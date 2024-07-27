import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `a naming bot\n\ncreate variations of the given name like\n\nInput: apple Output: appy, apples, appen, plen, ppen\n\nanother example, input:bask output: basky, basken, Aske, sken, bast\n\nInput:${input}\n\nplease return it in a JSON format.`
        }
      ],
      model: "llama3-8b-8192",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object"
      },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (content) {
      const parsedContent = JSON.parse(content);
      return NextResponse.json(parsedContent);
    } else {
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate names' }, { status: 500 });
  }
}