import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a funny meme caption generator. Create short, witty captions that would work well on meme images."
        },
        {
          role: "user",
          content: `Generate a funny meme caption for: ${prompt}`
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const caption = completion.choices[0].message.content;
    res.status(200).json({ caption });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
} 