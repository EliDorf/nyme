import DomainSearches from '@/lib/database/models/DomainSearches';
import { connectToDatabase } from '@/lib/database/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('POST request received at /api/save-domains');
  try {
    await connectToDatabase();
    console.log("Connected to database");

    const body = await request.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const { domains, userId, input } = body;

    const domainSearch = new DomainSearches({
      userId,
      input,
      domains: domains.map((domain: any) => ({
        name: domain.domain,
        status: domain.status.status,
        zone: domain.status.zone,
        summary: domain.status.summary
      })),
    });

    console.log("Domain search object:", JSON.stringify(domainSearch, null, 2));

    const savedSearch = await domainSearch.save();
    console.log("Domain search saved successfully:", JSON.stringify(savedSearch, null, 2));

    return NextResponse.json({ message: 'Domains saved successfully', id: savedSearch._id }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error saving domains:', error);
    
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json({ error: 'Error saving domains', details: errorMessage }, { status: 500 });
  }
}