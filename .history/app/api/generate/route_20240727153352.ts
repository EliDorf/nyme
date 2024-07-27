import { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { input } = req.body;

  try {
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
      res.status(200).json(parsedContent);
    } else {
      res.status(500).json({ error: 'No content generated' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate names' });
  }
}