'use client';

import React, { KeyboardEvent, useRef, useState } from 'react';

import './UserInput.scss';

interface UserInputProps {
  onSubmit: (input: string, image?: File) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input, image || undefined); // 确保传递图片
      setInput('');
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // 清除文件输入
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      // 验证文件大小（例如：限制为 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="user-input">
      <form onSubmit={handleSubmit} className="user-input__form">
        <textarea
          className="user-input__textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your message here... (Press Enter to submit)"
        />
        <div className="user-input__actions">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="user-input__upload-button"
          >
            Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="user-input__file-input"
          />
          {image && (
            <div className="user-input__file-preview">
              <span className="user-input__file-name">{image.name}</span>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="user-input__remove-image"
              >
                ✕
              </button>
            </div>
          )}
          <button
            type="submit"
            className={`user-input__submit-button ${
              isLoading ? 'user-input__submit-button--loading' : ''
            }`}
            disabled={isLoading || (!input.trim() && !image)}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInput;
