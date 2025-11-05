import React from 'react';

// Component for additional user instructions
interface InstructionsInputProps {
  value: string;
  onChange: (value: string) => void;
  labelText: string;
  placeholderText: string;
}

const InstructionsInput: React.FC<InstructionsInputProps> = ({ value, onChange, labelText, placeholderText }) => {
  return (
    <div className="w-full">
      <label htmlFor="instructions" className="block text-sm font-medium text-art-text mb-2 font-serif">
        {labelText}
      </label>
      <textarea
        id="instructions"
        name="instructions"
        rows={3}
        className="block w-full shadow-sm sm:text-sm border-art-subtle/50 rounded-md focus:ring-art-primary focus:border-art-primary bg-art-surface text-art-text placeholder-art-subtle"
        placeholder={placeholderText}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InstructionsInput;