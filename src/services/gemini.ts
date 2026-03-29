import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SocialStory {
  title: string;
  pages: {
    text: string;
    imagePrompt: string;
  }[];
}

export async function generateSocialStory(topic: string, childDetails: string): Promise<SocialStory> {
  const prompt = `Generate a Carol Gray style Social Story for a child. 
  Topic: ${topic}
  Child Details: ${childDetails}
  
  The story should follow the Carol Gray criteria:
  - Descriptive sentences (what happens, where, who)
  - Perspective sentences (how others feel/think)
  - Directive/Affirmative sentences (suggested responses)
  - Ratio: At least 2 descriptive/perspective sentences for every 1 directive sentence.
  - Positive and patient tone.
  
  Format the output as JSON with a title and an array of pages. Each page should have 'text' and a short 'imagePrompt' for an AI image generator to illustrate that page.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["text", "imagePrompt"]
            }
          }
        },
        required: ["title", "pages"]
      }
    }
  });

  return JSON.parse(response.text) as SocialStory;
}
