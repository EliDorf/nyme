import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("Received webhook event");
  
  try {
    const payload = await req.json();
    console.log("Webhook payload:", JSON.stringify(payload, null, 2));

    if (!payload || !payload.type) {
      console.error("Invalid payload structure");
      return new Response('Invalid payload', { status: 400 });
    }

    console.log("Event type:", payload.type);
    
    return NextResponse.json({ message: "Event received and logged" });
  } catch (error: unknown) {
    console.error('Error processing webhook:', error);
    
    if (error instanceof Error) {
      return new Response(`Error occurred: ${error.message}`, { status: 500 });
    } else {
      return new Response('An unknown error occurred', { status: 500 });
    }
  }
}