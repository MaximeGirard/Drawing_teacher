import React from 'react';
import type { Language } from '../types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onLanguageChange }) => {
  const buttonStyle = "px-3 py-1 text-sm font-medium rounded-md transition-colors";
  const activeStyle = "bg-art-primary text-white";
  const inactiveStyle = "bg-art-subtle/20 text-art-text hover:bg-art-subtle/40";

  return (
    <div className="flex items-center space-x-1 bg-art-subtle/20 p-1 rounded-lg">
      <button
        onClick={() => onLanguageChange('fr')}
        className={`${buttonStyle} ${currentLanguage === 'fr' ? activeStyle : inactiveStyle}`}
        aria-pressed={currentLanguage === 'fr'}
      >
        FR
      </button>
      <button
        onClick={() => onLanguageChange('en')}
        className={`${buttonStyle} ${currentLanguage === 'en' ? activeStyle : inactiveStyle}`}
        aria-pressed={currentLanguage === 'en'}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;