import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import dbConnect from '../../utils/dbConnect';
import DomainSearches from '../../models/DomainSearches';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name parameter is required' }, { status: 400 });
  }

  const options = {
    method: 'GET',
    url: 'https://domainr.p.rapidapi.com/v2/status',
    params: {
      domain: name
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'domainr.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching domain status:', error);
    return NextResponse.json({ error: 'Error fetching domain status' }, { status: 500 });
  }
}