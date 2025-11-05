// FIX: Removed self-import of 'GeneratedResult' which caused a naming conflict.
export type DrawingStyle = 'Simple' | 'Anatomy' | 'Detailed';
export type Language = 'en' | 'fr';

export interface DrawingAnalysis {
  guidelines: string;
  tips: string;
}

export interface GeneratedResult {
  image: string;
  analysis: DrawingAnalysis;
}
