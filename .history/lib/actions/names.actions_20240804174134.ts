import { NextRequest, NextResponse } from 'next/server';
import DomainSearches from '../../models/DomainSearches';
import dbConnect from '../../utils/dbConnect';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
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

    await domainSearch.save();

    return NextResponse.json({ message: 'Domains saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving domains:', error);
    return NextResponse.json({ error: 'Error saving domains' }, { status: 500 });
  }
}