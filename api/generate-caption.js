import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const body = await req.json();
    const { prompt } = body;

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

    return new Response(JSON.stringify({ caption: completion.choices[0].message.content }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate caption' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 