import OpenAI from "openai";

export async function handler(event, context) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // 🧠 variable cachée sur Netlify
  });

  try {
    const body = JSON.parse(event.body);
    const { messages } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: completion.choices[0].message }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
