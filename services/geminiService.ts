import { GoogleGenAI, Type } from "@google/genai";
import { DonationCategory } from "../types";

// NOTE: In a real app, this should be an environment variable.
// For the purpose of this assignment, we assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export interface AnalyzedDonation {
  category: DonationCategory;
  impactMessage: string;
  estimatedWeight?: number; // Optional guess if user forgot
}

export const analyzeDonationItems = async (itemsDescription: string): Promise<AnalyzedDonation> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini. Returning default analysis.");
    return {
      category: DonationCategory.OTHER,
      impactMessage: "Thank you for your generous donation to help Sri Lanka."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following donation item description intended for relief aid to Sri Lanka: "${itemsDescription}".
      
      Determine the most appropriate category from this list: Food, Medical, Clothing, Education, Other.
      Also, write a very short (max 10 words) inspiring impact message about how this specific donation helps.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: ["Food", "Medical", "Clothing", "Education", "Other"]
            },
            impactMessage: {
              type: Type.STRING
            }
          },
          required: ["category", "impactMessage"]
        }
      }
    });

    const jsonText = response.text;
    if (jsonText) {
      const result = JSON.parse(jsonText);
      return {
        category: result.category as DonationCategory,
        impactMessage: result.impactMessage
      };
    }
    
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      category: DonationCategory.OTHER,
      impactMessage: "Your contribution makes a real difference."
    };
  }
};
