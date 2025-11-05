import React, { useCallback, useState, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  labelText: string;
  dragText: string;
  browseText: string;
  fileTypesText: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  previewUrl,
  labelText,
  dragText,
  browseText,
  fileTypesText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-art-text mb-2 font-serif">{labelText}</label>
      <div
        className={`relative flex justify-center items-center w-full h-64 px-4 pt-5 pb-6 border-2 ${isDragging ? 'border-art-primary' : 'border-art-subtle/50'} border-dashed rounded-lg transition-colors duration-200 ease-in-out cursor-pointer bg-art-bg/50 hover:border-art-subtle`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="object-contain h-full w-full rounded-md" />
        ) : (
          <div className="space-y-1 text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-art-subtle" />
            <div className="flex text-sm text-art-subtle">
              <p className="pl-1">{dragText} <span className="font-semibold text-art-primary">{browseText}</span></p>
            </div>
            <p className="text-xs text-art-subtle/80">{fileTypesText}</p>
          </div>
        )}
        <input
          ref={inputRef}
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;