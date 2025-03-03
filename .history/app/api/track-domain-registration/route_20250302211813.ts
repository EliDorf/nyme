import DomainRegistration from '@/lib/database/models/DomainRegistration';
import { connectToDatabase } from '@/lib/database/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('POST request received at /api/track-domain-registration');
  try {
    await connectToDatabase();
    console.log("Connected to database");

    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const { userId, domainName, price, currency, affiliateLink } = body;

    // Validate required fields
    if (!userId || !domainName || !affiliateLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const domainRegistration = new DomainRegistration({
      userId,
      domainName,
      price: price || 9.99, // Default price if not provided
      currency: currency || 'USD', // Default currency if not provided
      status: 'initiated',
      affiliateLink
    });

    console.log("Domain registration object:", JSON.stringify(domainRegistration, null, 2));

    const savedRegistration = await domainRegistration.save();
    console.log("Domain registration saved successfully:", JSON.stringify(savedRegistration, null, 2));

    return NextResponse.json(
      { message: 'Domain registration tracked successfully', id: savedRegistration._id },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error tracking domain registration:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      { error: 'Error tracking domain registration', details: errorMessage },
      { status: 500 }
    );
  }
} 