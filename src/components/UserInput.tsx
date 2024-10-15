import React, { useState, useRef, KeyboardEvent } from "react";

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
    <div className="w-full p-4 bg-tech-dark-light border-t border-tech-accent">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          className="p-2 mb-4 bg-tech-dark text-tech-text border border-tech-accent rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-tech-highlight"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your message here... (Press Enter to submit)"
        />
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mr-4 px-4 py-2 bg-tech-accent text-tech-text rounded-md hover:bg-tech-highlight transition-colors"
          >
            Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          {image && <span className="text-tech-text">{image.name}</span>}
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md ${
            isLoading
              ? "bg-tech-accent text-tech-text cursor-not-allowed"
              : "bg-tech-highlight text-tech-dark hover:bg-tech-accent hover:text-tech-text"
          } transition-colors`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UserInput;
