"use server";

import { revalidatePath } from "next/cache";

import User from "../database/models/user.model";
import DomainSearch from "../database/models/DomainSearches";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { ObjectId } from 'mongodb';

// Fetch available domains for a user
export async function getAvailableDomainsForUser(userId: string) {
  try {
    await connectToDatabase();

    const domainSearches = await DomainSearch.find({ userId });
    
    // Flatten all domains from all searches and filter for available ones
    const availableDomains = domainSearches.flatMap(search => 
      search.domains.filter((domain: { status: string }) => 
        domain.status.includes('undelegated') || 
        domain.status.includes('inactive')
      )
    );

    // Remove duplicates based on domain name
    const uniqueDomains = Array.from(
      new Map(availableDomains.map((domain: { name: string }) => [domain.name, domain])).values()
    );

    return uniqueDomains;
  } catch (error) {
    console.error('Error fetching available domains:', error);
    throw error;
  }
}


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

    console.log('Creating new user with data:', user);
    
    // Check if user already exists to prevent duplicate creation attempts
    const existingUser = await User.findOne({ 
      $or: [
        { clerkId: user.clerkId },
        { email: user.email }
      ]
    });
    
    if (existingUser) {
      console.log('User already exists:', existingUser);
      return JSON.parse(JSON.stringify(existingUser));
    }
    
    // Ensure username is unique by adding a timestamp if needed
    if (!user.username || user.username.trim() === '') {
      user.username = `user_${user.clerkId.slice(-6)}`;
    }
    
    // Add a timestamp to ensure uniqueness in case of conflicts
    const timestamp = Date.now().toString().slice(-4);
    const usernameExists = await User.findOne({ username: user.username });
    if (usernameExists) {
      user.username = `${user.username}_${timestamp}`;
    }
    
    const newUser = await User.create(user);

    if (!newUser) {
      console.error('Failed to create user:', user);
      throw new Error('Failed to create user');
    }

    console.log('Successfully created user:', newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error; // Let the webhook handler handle the error
  }
}

// READ
import { clerkClient } from "@clerk/nextjs/server";

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    console.log('Getting user with Clerk ID:', userId);
    
    // Try both ways to find the user
    let user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      // If not found by clerkId, try getting the MongoDB _id from Clerk metadata
      const clerkUser = await clerkClient.users.getUser(userId);
      const mongoDbId = clerkUser.publicMetadata.userId;
      
      if (mongoDbId) {
        console.log('Found MongoDB ID in Clerk metadata:', mongoDbId);
        user = await User.findById(mongoDbId);
      }
    }

    if (!user) {
      console.error('User not found for ID:', userId);
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
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

    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if (!updatedUserCredits) {
      console.log(`User not found for _id: ${userId}`);
      throw new Error(`User not found for _id: ${userId}`);
    }

    console.log(`Updated credit balance: ${updatedUserCredits.creditBalance}`);

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
}
