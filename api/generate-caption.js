export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a funny meme caption generator. Create short, witty captions."
          },
          {
            role: "user",
            content: "Generate a short, funny meme caption under 10 words."
          }
        ],
        max_tokens: 20,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate caption');
    }

    const data = await response.json();
    return res.status(200).json({ 
      caption: data.choices[0].message.content.trim() 
    });

  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({
      error: 'Failed to generate caption',
      message: error.message
    });
  }
} 