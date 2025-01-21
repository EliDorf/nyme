/* eslint-disable camelcase */
import { createTransaction } from "../../../../lib/actions/transaction.action";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { trackPurchaseComplete } from "../../../../lib/analytics/dataLayer";
import Transaction from "../../../../lib/database/models/transaction.model";
import { connectToDatabase } from "../../../../lib/database/mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  const eventType = event.type;

  try {
    await connectToDatabase();
    
    switch (eventType) {
      // Initial subscription creation
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        const transaction = {
          stripeId: session.id,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          plan: session.metadata?.plan || "",
          credits: Number(session.metadata?.credits) || 0,
          buyerId: session.metadata?.buyerId || "",
          createdAt: new Date(),
          subscriptionId: subscription.id,
          isSubscription: true,
          subscriptionStatus: 'active'
        };

        const newTransaction = await createTransaction(transaction);

        // Track purchase complete event
        trackPurchaseComplete(
          session.id,
          [{
            domainName: session.metadata?.plan || "Credit Subscription",
            price: session.amount_total ? session.amount_total / 100 : 0
          }],
          session.amount_total ? session.amount_total / 100 : 0,
          'USD'
        );
        
        return NextResponse.json({ message: "OK", transaction: newTransaction });
      }

      // Monthly subscription renewal
      case "invoice.paid": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const session = await stripe.checkout.sessions.retrieve(subscription.metadata.checkout_session_id);
          
          const transaction = {
            stripeId: invoice.id,
            amount: invoice.amount_paid / 100,
            plan: session.metadata?.plan || "",
            credits: Number(session.metadata?.credits) || 0,
            buyerId: session.metadata?.buyerId || "",
            createdAt: new Date(),
            subscriptionId: subscription.id,
            isSubscription: true,
            subscriptionStatus: 'active'
          };

          await createTransaction(transaction);
        }
        return new Response("", { status: 200 });
      }

      // Handle subscription status changes
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        if (subscription.id) {
          await Transaction.updateMany(
            { subscriptionId: subscription.id },
            { subscriptionStatus: subscription.status }
          );
        }
        return new Response("", { status: 200 });
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        if (subscription.id) {
          await Transaction.updateMany(
            { subscriptionId: subscription.id },
            { subscriptionStatus: 'canceled' }
          );
        }
        return new Response("", { status: 200 });
      }

      default:
        return new Response("", { status: 200 });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
