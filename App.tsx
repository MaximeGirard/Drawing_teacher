import React, { useState } from 'react';
import type { DrawingStyle, GeneratedResult, Language } from './types';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import GeneratedResultView from './components/GeneratedResultView';
import { generateDrawingAndAnalysis } from './services/geminiService';
import { SparklesIcon, LogoIcon } from './components/icons';
import InstructionsInput from './components/InstructionsInput';
import LanguageSwitcher from './components/LanguageSwitcher';
import { translations } from './i18n/translations';


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('fr');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [drawingStyle, setDrawingStyle] = useState<DrawingStyle>('Simple');
  const [userInstructions, setUserInstructions] = useState('');
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    if (uploadedImagePreview) {
      URL.revokeObjectURL(uploadedImagePreview);
    }
    setUploadedImagePreview(URL.createObjectURL(file));
    setGeneratedResult(null);
    setError(null);
  };

  const handleGenerateClick = async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const result = await generateDrawingAndAnalysis(uploadedImage, drawingStyle, userInstructions, language);
      setGeneratedResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-art-bg font-sans text-art-text">
      <header className="bg-art-surface border-b border-art-subtle/30">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoIcon className="text-art-primary"/>
            <h1 className="text-2xl font-bold text-art-text font-serif">{t.headerTitle}</h1>
          </div>
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8 bg-art-surface p-6 rounded-xl border border-art-subtle/30 shadow-sm space-y-6">
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                previewUrl={uploadedImagePreview} 
                labelText={t.uploadLabel}
                dragText={t.dragText}
                browseText={t.browseText}
                fileTypesText={t.fileTypesText}
              />
              <StyleSelector 
                selectedStyle={drawingStyle} 
                onStyleChange={setDrawingStyle}
                labelText={t.styleLabel}
              />
              <InstructionsInput 
                value={userInstructions} 
                onChange={setUserInstructions}
                labelText={t.instructionsLabel}
                placeholderText={t.instructionsPlaceholder}
              />
              <button
                type="button"
                onClick={handleGenerateClick}
                disabled={!uploadedImage || isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-art-primary hover:bg-art-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-art-primary disabled:bg-art-primary/50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.generatingButton}
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {t.generateButton}
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Results Column */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-art-surface p-6 sm:p-8 rounded-xl border border-art-subtle/30 shadow-sm min-h-[calc(100vh-12rem)]">
              <GeneratedResultView
                result={generatedResult}
                isLoading={isLoading}
                error={error}
                hasUploadedImage={!!uploadedImage}
                translations={{
                  errorTitle: t.errorTitle,
                  resultTitle: t.resultTitle,
                  guidelinesTitle: t.guidelinesTitle,
                  tipsTitle: t.tipsTitle,
                  welcomeTitle: t.welcomeTitle,
                  welcomeMessageWithImage: t.welcomeMessageWithImage,
                  welcomeMessageWithoutImage: t.welcomeMessageWithoutImage,
                  contrastLabel: t.contrastLabel,
                }}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;