import React from 'react';
import type { DrawingStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: DrawingStyle;
  onStyleChange: (style: DrawingStyle) => void;
  labelText: string;
}

const styles: { name: DrawingStyle; description: string }[] = [
  { name: 'Simple', description: 'Clean contour lines' },
  { name: 'Anatomy', description: 'Construction & form' },
  { name: 'Detailed', description: 'Shading & textures' },
];

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange, labelText }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-art-text mb-2 font-serif">{labelText}</label>
      <div className="grid grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style.name}
            type="button"
            onClick={() => onStyleChange(style.name)}
            className={`text-center p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-art-primary ${
              selectedStyle === style.name
                ? 'bg-art-primary text-white border-art-primary shadow-sm'
                : 'bg-art-surface text-art-text border-art-subtle/50 hover:border-art-subtle hover:bg-art-bg/50'
            }`}
          >
            <p className="font-semibold text-sm">{style.name}</p>
            <p className="text-xs opacity-80">{style.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;