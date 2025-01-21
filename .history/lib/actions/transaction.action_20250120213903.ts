"use server";

import { redirect } from 'next/navigation';
import Stripe from "stripe";
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import User from '../database/models/user.model';
import { updateCredits } from './user.action';

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  // Get or create the product
  let product = await stripe.products.list({
    active: true,
    name: transaction.plan
  }).then(res => res.data[0]);

  if (!product) {
    product = await stripe.products.create({
      name: transaction.plan,
      description: `Monthly subscription for ${transaction.credits} credits`
    });
  }

  // Get or create the price
  let price = await stripe.prices.list({
    product: product.id,
    active: true,
    recurring: { interval: 'month' }
  }).then(res => res.data[0]);

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      unit_amount: amount,
      recurring: { interval: 'month' }
    });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: price.id,
        quantity: 1
      }
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: 'subscription',
    success_url: `https://app.nyme.ai?success=true&session_id={CHECKOUT_SESSION_ID}&plan=${transaction.plan}&amount=${amount}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/credits?canceled=true`,
  });

  redirect(session.url!);
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // First find the user by clerkId to get their MongoDB _id
    const user = await User.findOne({ clerkId: transaction.buyerId });
    if (!user) {
      throw new Error(`User not found with clerkId: ${transaction.buyerId}`);
    }

    // Create a new transaction with the MongoDB _id
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: user._id
    });

    // Update credits using the MongoDB _id
    await updateCredits(user._id.toString(), transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
