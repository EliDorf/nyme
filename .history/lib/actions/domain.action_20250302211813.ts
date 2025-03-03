"use server";

import { connectToDatabase } from "../database/mongoose";
import DomainRegistration from "../database/models/DomainRegistration";
import { handleError } from "../utils";

/**
 * Track a domain registration attempt
 */
export async function trackDomainRegistration(
  userId: string,
  domainName: string,
  price: number = 9.99,
  currency: string = 'USD',
  affiliateLink: string
) {
  try {
    await connectToDatabase();

    const domainRegistration = new DomainRegistration({
      userId,
      domainName,
      price,
      currency,
      status: 'initiated',
      affiliateLink
    });

    await domainRegistration.save();
    
    return { success: true };
  } catch (error) {
    handleError(error);
    return { success: false, error };
  }
}

/**
 * Get all domain registrations for a user
 */
export async function getUserDomainRegistrations(userId: string) {
  try {
    await connectToDatabase();

    const registrations = await DomainRegistration.find({ userId })
      .sort({ registrationDate: -1 }) // Most recent first
      .lean();
    
    return registrations;
  } catch (error) {
    handleError(error);
    return [];
  }
} 