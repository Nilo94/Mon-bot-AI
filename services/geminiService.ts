import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_CV } from "../constants";

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to simulate delay for "thinking" effect
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateEmailDraft = async (
  recipientEmail: string, 
  organization: string,
  source: string = "Web Scraping"
): Promise<{ subject: string; body: string }> => {
  if (!process.env.API_KEY) {
    // Fallback for demo without key
    return {
      subject: `Candidature ${source === 'Indeed' ? 'via Indeed ' : ''}- Marketing Digital - ${organization}`,
      body: `Madame, Monsieur,\n\nSuite à votre offre vue sur ${source}, je vous propose mes compétences.\n\nCordialement,\nColin`
    };
  }

  try {
    const prompt = `
      You are Agent 1.2 (Rédacteur). Write a professional email for a Digital Marketing position.
      Target Organization: ${organization}
      Contact Email: ${recipientEmail}
      Lead Source: ${source}
      
      Requirements:
      - If source is 'Indeed', mention "Suite à votre offre publiée sur Indeed".
      - If source is 'Web Scraping', frame it as a "Candidature Spontanée".
      - Highlight skills: SEO, WordPress, Google Ads.
      - Tone: Professional, enthusiastic.
      - Language: French.
      
      Return as JSON with keys: "subject" and "body".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025', // Using latest available model
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Pas de réponse de Gemini");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Erreur Gemini (Email):", error);
    return {
      subject: "Erreur de génération",
      body: "Impossible de générer le contenu en raison d'une erreur API."
    };
  }
};

export const checkQuality = async (
  emailBody: string, 
  organization: string
): Promise<{ approved: boolean; feedback: string }> => {
  if (!process.env.API_KEY) return { approved: true, feedback: "Approbation simulée (Pas de clé API)" };

  try {
    const prompt = `
      You are Agent 1.3 (Contrôleur Qualité). Review this email drafted for ${organization}.
      
      Email Body: "${emailBody}"
      
      Check for:
      - Spelling/Grammar errors.
      - Professional tone.
      - Mention of specific skills (SEO, WordPress).
      
      Return JSON:
      - approved: boolean (true if good, false if major issues).
      - feedback: string (short comment in French).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            approved: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Pas de réponse");
    return JSON.parse(text);

  } catch (error) {
    return { approved: false, feedback: "Erreur API lors du contrôle qualité." };
  }
};

export const optimizeCV = async (): Promise<string> => {
  if (!process.env.API_KEY) return INITIAL_CV + "\n[MODE OPTIMISÉ: Spécialiste SEO]";

  try {
    const prompt = `
      You are Agent 1.4 (Optimiseur de CV). Analyze and rewrite this CV to make it perfect for a Digital Marketing / SEO Specialist role.
      
      Current CV:
      ${INITIAL_CV}
      
      Tasks:
      1. Add a professional summary.
      2. Enhance the skills section with keywords (SEO, SEA, Analytics, CMS).
      3. Rewrite experiences to sound more impactful.
      4. Language: French.
      
      Return plain text formatted nicely.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025',
      contents: prompt,
    });

    return response.text || "Échec de l'optimisation du CV.";
  } catch (error) {
    return "Erreur API lors de l'optimisation du CV.";
  }
};

export const generateFinalReport = async (stats: any): Promise<string> => {
  if (!process.env.API_KEY) return "Rapport de simulation : Processus terminé avec succès.";

  try {
    const prompt = `
      You are Agent 1.5 (Analyste). Write a short executive summary report based on these stats:
      ${JSON.stringify(stats)}
      
      Include:
      - Key achievements.
      - Mention the integration of Indeed as a new source.
      - Recommendation for Agent 1.0.
      - Language: French.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025',
      contents: prompt,
    });

    return response.text || "Échec de la génération du rapport.";
  } catch (error) {
    return "Erreur API lors de la génération du rapport.";
  }
};