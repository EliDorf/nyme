"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { ObjectId } from 'mongodb';


type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
};

type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
};

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITSimport { ObjectId } from 'mongodb'; // Make sure to import this

export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    console.log(`Updating credits for user with _id: ${userId}`);
    console.log(`Credit fee to be added: ${creditFee}`);

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if(!updatedUserCredits) {
      console.log(`User credits update failed for _id: ${userId}`);
      throw new Error("User credits update failed");
    }

    console.log(`Updated credit balance: ${updatedUserCredits.creditBalance}`);

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    console.error("Error in updateCredits:", error);
    handleError(error);
  }
}

async function updateCreditsWithClerkId(clerkId: string, creditFee: number) {
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new Error("User not found");
  }
  return updateCredits(user._id.toString(), creditFee);
}