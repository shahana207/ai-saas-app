import OpenAI from "openai";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function testGemini() {
  try {
    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "user", content: "Say hello in a friendly way" }
      ],
      temperature: 0.7,
      max_tokens: 50
    });

    console.log("✅ API Works! Response:");
    console.log(response.choices[0].message.content);

  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
  }
}

testGemini();