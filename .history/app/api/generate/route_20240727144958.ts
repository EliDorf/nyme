import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { input } = await req.json()
  console.log("Received input:", input)

  // Generate suggestions (replace this with your actual logic)
  const suggestions = [
    input + "studio",
    input + "123",
    input + "co",
    input + "inc",
    input + "design"
  ]

  console.log("Sending suggestions:", suggestions)
  return NextResponse.json({ suggestions })
}