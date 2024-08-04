import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "../../../lib/database/mongoose";
import DomainSearches from '../../../lib/database/models/DomainSearches';

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

    return NextResponse.json({ message: 'Domains saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving domains:', error);
    return NextResponse.json({ error: 'Error saving domains' }, { status: 500 });
  }
}