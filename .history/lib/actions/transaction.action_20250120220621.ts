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
  const products = await stripe.products.search({
    query: `active:\'true\' AND name:\'${transaction.plan}\'`
  });
  let product = products.data[0];

  if (!product) {
    product = await stripe.products.create({
      name: transaction.plan,
      description: transaction.plan === "Starter Package" 
        ? `One-time purchase of ${transaction.credits} credits`
        : `Monthly subscription for ${transaction.credits} credits`
    });
  }

  // Get or create the price based on plan type
  const isStarterPackage = transaction.plan === "Starter Package";
  const prices = await stripe.prices.search({
    query: `active:\'true\' AND product:\'${product.id}\' AND type:\'${isStarterPackage ? 'one_time' : 'recurring'}\'`
  });
  let price = prices.data[0];

  if (!price) {
    const priceData: Stripe.PriceCreateParams = {
      product: product.id,
      currency: 'usd',
      unit_amount: amount,
    };

    // Add recurring config only for non-starter packages
    if (!isStarterPackage) {
      priceData.recurring = { interval: 'month' };
    }

    price = await stripe.prices.create(priceData);
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
    mode: isStarterPackage ? 'payment' : 'subscription',
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
