import OpenAI from 'openai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a funny meme caption generator. Create short, witty captions that would work well on meme images. Keep responses under 10 words."
        },
        {
          role: "user",
          content: "Generate a funny meme caption"
        }
      ],
      max_tokens: 30,
      temperature: 0.7,
    });

    return new Response(
      JSON.stringify({ 
        caption: completion.choices[0].message.content.trim() 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate caption. Please try again.' 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
} 