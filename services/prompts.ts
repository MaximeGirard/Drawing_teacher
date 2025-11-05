import type { DrawingStyle } from '../types';

export const getImageGenerationPrompt = (style: DrawingStyle, userInstructions: string): string => {
  const stylePrefix = `You are a drawing assistant. Your primary task is to generate a pencil sketch based on an uploaded image and user instructions.

**IMPORTANT RULE 1 (No Instructions):** If no specific user instructions are provided, you MUST create a drawing of the ENTIRE subject from the uploaded image. The composition must be a 1:1 representation of the original. DO NOT zoom, crop, change the angle, or focus on a specific part. The drawing must show the full subject as seen in the source image.

**IMPORTANT RULE 2 (With Instructions):** If the user provides instructions to focus on, zoom into, or detail a specific part of the image (e.g., 'the face', 'the hands', 'the visage'), you MUST generate a zoomed-in sketch of ONLY that part. This instruction overrides the default behavior of drawing the full subject.

The background must always be plain white.

**Style Goal:** The sketch's style should be consistent, as if drawn by the same artist with a specific technique. Maintain this style across different generations.`;

  let basePrompt: string;

  switch (style) {
    case 'Anatomy':
      basePrompt = `${stylePrefix} The drawing must be in a 'how-to-draw' anatomical style, focusing entirely on the construction and foundational planning phase. It should reveal the 'thinking process' of a master artist.
**IMPORTANT:** The primary visual elements MUST be the underlying geometric shapes (spheres, cylinders, boxes) and all the foundational 'scaffolding' an artist would use. This includes:
*   **Construction Shapes:** Dark, clear lines for joints, limbs, torso, etc.
*   **Perspective Lines:** Show perspective guidelines if applicable to the landscape.
*   **Light Source:** Use simple arrows or lines to indicate the direction of the main light source.
*   **Support Structures:** Show the internal structural lines that support different body parts.

In stark contrast, the final contour lines that define the subject's surface should be extremely faint, light, and sketchy, like a ghosted overlay. The goal is to teach the anatomical foundation and the artist's planning process. The construction and planning lines MUST dominate the image. The result should look like an authentic page from a master artist's anatomical study sketchbook, filled with planning and structural detail.`;
      break;
    case 'Detailed':
      basePrompt = `${stylePrefix} The drawing must be a highly detailed, realistic pencil drawing. If the user has requested a specific area of focus, apply this detailed style ONLY to that zoomed-in part. Employ techniques like cross-hatching and smooth blending for shading. Emphasize intricate textures and subtle value shifts to create a sense of depth and photorealism. The result should look like an advanced artwork created with graphite pencils on textured paper.`;
      break;
    case 'Simple':
    default:
      basePrompt = `${stylePrefix} The drawing must be a simple, clean pencil line drawing (contour drawing). If the user has requested a specific area of focus, apply this minimalist style ONLY to that zoomed-in part. Focus exclusively on the main outlines. Use a single, consistent line weight. The style must be minimalist, elegant, and modern, capturing the subject's essence with the fewest lines possible. No shading or internal details.`;
      break;
  }

  return userInstructions
    ? `${basePrompt}\n\nAdditional user instructions to follow: "${userInstructions}"`
    : basePrompt;
};

export const getAnalysisPrompt = (userInstructions: string): string => {
    return `You are a friendly and encouraging drawing teacher. Analyze the subject in the uploaded image.

${userInstructions ? `The user has provided specific instructions: "${userInstructions}". Your analysis MUST focus entirely on this request. For example, if they ask to zoom on a 'visage', your guidelines and tips should only be about drawing the face, ignoring the rest of the body.` : ''}

Provide 'General Guidelines' on how to approach drawing the subject (or the specified part), and a separate list of 'Tips' for capturing its key features. Structure your response as a JSON object with two keys: 'guidelines' (a string with markdown newlines, using '*' for bullet points and '**' for bold) and 'tips' (a string with markdown newlines, using '*' for bullet points and '**' for bold).`;
};