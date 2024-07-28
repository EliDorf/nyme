import { Schema, model, models } from "mongoose";
const mongoose = require('mongoose');

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  planId: {
    type: Number,
    default: 1,
  },
  creditBalance: {
    type: Number,
    default: 10,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;