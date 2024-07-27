import { NextApiRequest, NextApiResponse } from 'next';
import { generateNames } from '@/lib/actions/groq.action';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { input } = req.body;
      const suggestions = await generateNames(input);
      res.status(200).json({ suggestions });
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: 'Failed to generate names' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}