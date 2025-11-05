import { GoogleGenAI, Modality, Type } from '@google/genai';
import type { DrawingStyle, DrawingAnalysis, GeneratedResult, Language } from '../types';
import { getImageGenerationPrompt, getAnalysisPrompt } from './prompts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    if (targetLanguage === 'en' || !text) {
        return text;
    }
    const languageName = targetLanguage === 'fr' ? 'French' : 'English';
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following markdown text to ${languageName}. Preserve the markdown formatting (like '*' for bullet points and '**' for bold text). Text to translate:\n\n${text}`,
        });
        return response.text;
    } catch (e) {
        console.error("Translation failed:", e);
        return text; // Return original text if translation fails
    }
};

export const generateDrawingAndAnalysis = async (
  imageFile: File,
  style: DrawingStyle,
  userInstructions: string,
  targetLanguage: Language,
): Promise<GeneratedResult> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const imageGenerationPromise = (async () => {
    const finalPrompt = getImageGenerationPrompt(style, userInstructions);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, { text: finalPrompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response.promptFeedback?.blockReason) {
      throw new Error(`Image generation blocked. Reason: ${response.promptFeedback.blockReason}.`);
    }

    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error('Image generation failed: No response candidate was received from the model.');
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      throw new Error(`Image generation failed. Finish reason: ${candidate.finishReason}.`);
    }

    const firstPart = candidate.content?.parts[0];
    if (firstPart && firstPart.inlineData) {
      return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }

    throw new Error('Image generation failed: The model did not return any image data.');
  })();

  const analysisGenerationPromise = (async () => {
    const analysisPrompt = getAnalysisPrompt(userInstructions);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [imagePart, { text: analysisPrompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            guidelines: { type: Type.STRING, description: "General guidelines for drawing the subject, formatted with markdown newlines." },
            tips: { type: Type.STRING, description: "Specific tips for drawing the subject, formatted with markdown newlines." },
          },
          required: ['guidelines', 'tips'],
        },
      },
    });

    if (response.promptFeedback?.blockReason) {
        throw new Error(`Analysis generation blocked. Reason: ${response.promptFeedback.blockReason}.`);
    }

    const text = response.text;
    if (!text) {
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             throw new Error(`Analysis generation failed. Finish reason: ${finishReason}.`);
        }
        throw new Error("Analysis generation failed: No text was returned from the model.");
    }

    try {
      return JSON.parse(text) as DrawingAnalysis;
    } catch (e) {
      console.error("Failed to parse analysis JSON:", text);
      throw new Error("Failed to parse drawing analysis from the model. The model may have returned an invalid JSON format.");
    }
  })();

  const [generatedImage, analysisInEnglish] = await Promise.all([
    imageGenerationPromise,
    analysisGenerationPromise,
  ]);

  const [translatedGuidelines, translatedTips] = await Promise.all([
      translateText(analysisInEnglish.guidelines, targetLanguage),
      translateText(analysisInEnglish.tips, targetLanguage)
  ]);

  const finalAnalysis = {
      guidelines: translatedGuidelines,
      tips: translatedTips
  };

  return { image: generatedImage, analysis: finalAnalysis };
};
