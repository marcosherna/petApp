import { Groq } from "groq-sdk";

const API_KEY = "";

export const groq = new Groq({
  apiKey: API_KEY,
});

export async function askGroq(prompt: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices?.[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Error al consultar Groq:", error);
    return "La IA no pudo procesar tu solicitud 🐾";
  }
}
