import React, { useState, useRef, KeyboardEvent } from "react";
import "./UserInput.scss";

interface UserInputProps {
  onSubmit: (input: string, image?: File) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input, image || undefined);
      setInput("");
      setImage(null);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
          {image && <span className="user-input__file-name">{image.name}</span>}
          <button
            type="submit"
            className={`user-input__submit-button ${
              isLoading ? "user-input__submit-button--loading" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInput;
