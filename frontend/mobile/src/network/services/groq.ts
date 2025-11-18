/*import { Groq } from "groq-sdk";

const API_KEY = "aquí vamos a colocar la API KEY de Groq";

if (!API_KEY) {
  console.warn("No se encontró la API KEY de Groq.");
}

export const groq = new Groq({
  apiKey: API_KEY,
});
export async function askGroq(prompt: string) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
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
    return null;
  }
}*/
