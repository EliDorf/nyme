import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  subscriptionId: {
    type: String,
    sparse: true,
  },
  isSubscription: {
    type: Boolean,
    default: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'past_due', null],
    default: null
  }
});

const Transaction = models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
