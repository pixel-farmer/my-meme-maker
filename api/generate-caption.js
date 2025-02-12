import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Generate a short, funny meme caption under 10 words.",
      max_tokens: 20,
      temperature: 0.7,
    });

    const caption = response.data.choices[0].text.trim();
    return res.status(200).json({ caption });

  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({
      error: 'Failed to generate caption',
      message: error.message
    });
  }
} 