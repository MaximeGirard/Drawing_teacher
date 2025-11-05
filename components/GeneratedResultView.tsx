import React, { useState, useEffect } from 'react';
import type { GeneratedResult } from '../types';
import { PencilIcon, ErrorIcon } from './icons';
import ContrastSlider from './ContrastSlider';

interface GeneratedResultViewProps {
  result: GeneratedResult | null;
  isLoading: boolean;
  error: string | null;
  hasUploadedImage: boolean;
  translations: {
    errorTitle: string;
    resultTitle: string;
    guidelinesTitle: string;
    tipsTitle: string;
    welcomeTitle: string;
    welcomeMessageWithImage: string;
    welcomeMessageWithoutImage: string;
    contrastLabel: string;
  };
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-8">
        <div className="bg-stone-200 h-80 w-full rounded-lg"></div>
        <div className="space-y-4">
            <div className="bg-stone-200 h-6 w-1/3 rounded"></div>
            <div className="bg-stone-200 h-4 w-full rounded"></div>
            <div className="bg-stone-200 h-4 w-5/6 rounded"></div>
        </div>
        <div className="space-y-4">
            <div className="bg-stone-200 h-6 w-1/4 rounded"></div>
            <div className="bg-stone-200 h-4 w-full rounded"></div>
            <div className="bg-stone-200 h-4 w-full rounded"></div>
            <div className="bg-stone-200 h-4 w-4/6 rounded"></div>
        </div>
    </div>
);

const AnalysisSection: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const createMarkup = (text: string) => {
        if (!text) return { __html: '' };

        const html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
                if (line.startsWith('* ')) {
                    return `<li>${line.substring(2)}</li>`;
                }
                return `<p>${line}</p>`;
            })
            .join('')
            .replace(/<\/p><li>/g, '<li>')
            .replace(/<\/li><p>/g, '</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/<\/ul><ul>/g, '');

        return { __html: html };
    };
    
    return (
        <div>
            <h3 className="text-2xl font-semibold text-art-text mb-3 font-serif">{title}</h3>
            <div
                className="prose prose-sm max-w-none text-art-text/90 prose-strong:text-art-text prose-li:my-1"
                dangerouslySetInnerHTML={createMarkup(content)}
            />
        </div>
    );
};


const GeneratedResultView: React.FC<GeneratedResultViewProps> = ({ result, isLoading, error, hasUploadedImage, translations }) => {
    const [contrast, setContrast] = useState(100);

    // Reset contrast whenever a new image is generated
    useEffect(() => {
        setContrast(100);
    }, [result]);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-red-800 bg-red-50 p-6 rounded-lg border border-red-200">
                <ErrorIcon className="w-12 h-12 mb-4 text-red-500" />
                <p className="font-semibold font-serif text-lg">{translations.errorTitle}</p>
                <p className="text-sm mt-2 max-w-md">{error}</p>
            </div>
        );
    }
    
    if (result) {
        return (
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-bold text-art-text mb-4 font-serif">{translations.resultTitle}</h2>
                    <div className="bg-art-bg p-2 rounded-lg shadow-sm border border-art-subtle/30 space-y-4">
                        <img 
                          src={result.image} 
                          alt="Generated drawing" 
                          className="w-full rounded-md object-contain transition-all duration-150"
                          style={{ filter: `contrast(${contrast / 100})` }}
                        />
                         <div className="px-2 pb-2">
                           <ContrastSlider 
                                value={contrast} 
                                onChange={setContrast}
                                labelText={translations.contrastLabel}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-8">
                    <AnalysisSection title={translations.guidelinesTitle} content={result.analysis.guidelines} />
                    <AnalysisSection title={translations.tipsTitle} content={result.analysis.tips} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-art-subtle">
            <PencilIcon className="w-16 h-16 mb-4 text-art-subtle/40" />
            <h3 className="text-2xl font-medium font-serif">{translations.welcomeTitle}</h3>
            <p className="mt-2 max-w-md text-art-text/80">
                {hasUploadedImage
                    ? translations.welcomeMessageWithImage
                    : translations.welcomeMessageWithoutImage}
            </p>
        </div>
    );
};

export default GeneratedResultView;