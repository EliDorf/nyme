import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import NameSuggestion from '@/lib/database/models/NameSuggestion'; // Adjust the import path as needed
import { connectToDatabase } from '@/lib/database/mongoose'; // Assuming you have a function to connect to MongoDB
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Define the prompts for different modes
const PROMPTS = {
  short: 'You are a creative naming assistant. Generate 5 creative name variations based on the given input. The shorter the better. Ideally under 6 letters or unders for the suggestions(four is best), and make sure it resemble what could be consider real word and looks like a real work based on its structure and how it is read. Return only a JSON object with a "suggestions" key containing an array of string suggestions. Use double quotes for JSON keys and string values. For example, if the input is "apple", the output might be: {"suggestions": ["Appy", "Apples", "Appen", "Plen", "Pren"] }, another example, if the input is "Bask", the output might be: {"suggestions": ["Basky", "Baske", "Asky", "Basen", "Basre"] } , if the input is "Purchase", the output might be: {"suggestions": ["repurchase", "purch", "chase", "Buying", "sale"] }',
  synonym: 'You are a creative naming assistant specializing in synonyms. Generate 5 creative name variations based on synonyms or related concepts to the given input. Focus on meaningful alternatives that capture the essence or purpose of the original word. Return only a JSON object with a "suggestions" key containing an array of string suggestions. Use double quotes for JSON keys and string values. For example, if the input is "swift", the output might be: {"suggestions": ["Quick", "Rapid", "Speedy", "Flash", "Zoom"] }, if the input is "Build", the output might be: {"suggestions": ["Craft", "Forge", "Create", "Construct", "Make"] }, if the input is "Bright", the output might be: {"suggestions": ["Shine", "Glow", "Radiant", "Vivid", "Lumen"] } in no case should the ouput be multple words with spaces, it should only be everything should be one word no spaces or hifens and the preference should be towards one word!'
};

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the user ID from Clerk
    const { userId } = getAuth(request);

    const body = await request.json();
    const { input, mode = 'short' } = body;
    console.log("Received input:", input, "for userId:", userId, "with mode:", mode);

    // Select the appropriate prompt based on the mode
    const systemPrompt = PROMPTS[mode as keyof typeof PROMPTS] || PROMPTS.short;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate creative name variations for: ${input}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" }
    });

    console.log("Raw Groq response:", chatCompletion);

    const content = chatCompletion.choices[0]?.message?.content;
    console.log("Content from Groq:", content);

    if (content) {
      try {
        const parsedContent = JSON.parse(content);
        console.log("Parsed content:", parsedContent);
        
        if (Array.isArray(parsedContent.suggestions)) {
          // Save to database
          const nameSuggestion = new NameSuggestion({
            userId: userId || 'anonymous', // Use 'anonymous' if userId is not available
            input,
            suggestions: parsedContent.suggestions,
            mode
          });
          await nameSuggestion.save();
          console.log("Saved to database successfully");

          return NextResponse.json({ suggestions: parsedContent.suggestions });
        } else {
          console.error("Invalid response format from Groq");
          return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
        }
      } catch (parseError) {
        console.error("Error parsing Groq response:", parseError);
        return NextResponse.json({ error: 'Error parsing response', details: content }, { status: 500 });
      }
    } else {
      console.error("No content generated by Groq");
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate names' }, { status: 500 });
  }
}