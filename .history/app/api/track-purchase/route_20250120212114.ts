import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { transactionId, plan, amount } = await request.json();

    // Return success - actual tracking will happen client-side through dataLayer
    return NextResponse.json({ 
      success: true,
      message: "Purchase tracking initiated"
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      message: "Failed to track purchase"
    }, { status: 500 });
  }
}
