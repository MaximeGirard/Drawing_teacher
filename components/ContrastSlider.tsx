import React from 'react';

interface ContrastSliderProps {
  value: number;
  onChange: (value: number) => void;
  labelText: string;
}

const ContrastSlider: React.FC<ContrastSliderProps> = ({ value, onChange, labelText }) => {
  return (
    <div className="w-full">
      <label htmlFor="contrast-slider" className="block text-sm font-medium text-art-text mb-1 font-serif">
        {labelText}
      </label>
      <div className="flex items-center space-x-4">
        <input
          id="contrast-slider"
          type="range"
          min="50"
          max="200"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-art-subtle/30 rounded-lg appearance-none cursor-pointer"
          aria-label={labelText}
          // FIX: Cast style object to React.CSSProperties to allow for CSS custom properties.
          style={{ 
            '--thumb-color': '#C75D2A',
            '--track-color': '#DCD6CE'
          } as React.CSSProperties}
        />
        <span className="text-sm text-art-text/80 font-mono w-10 text-center">{value}%</span>
      </div>
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          background: var(--thumb-color);
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          margin-top: -6px;
        }
        input[type=range]::-moz-range-thumb {
          background: var(--thumb-color);
          height: 1rem;
          width: 1rem;
          border-radius: 9999px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default ContrastSlider;