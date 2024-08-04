import { NextRequest, NextResponse } from 'next/server';
import DomainSearches from '../../models/DomainSearches';
import { connectToDatabase } from '../../utils/database';

export async function POST(request: NextRequest) {
  console.log("Save domains API route called");
  try {
    await connectToDatabase();
    console.log("Connected to database");

    const body = await request.json();
    console.log("Received body:", body);

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

    console.log("Domain search object:", domainSearch);

    await domainSearch.save();
    console.log("Domain search saved successfully");

    return NextResponse.json({ message: 'Domains saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving domains:', error);
    return NextResponse.json({ error: 'Error saving domains', details: error.message }, { status: 500 });
  }
}