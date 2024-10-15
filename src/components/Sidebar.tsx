import React, { useState } from "react";

import { useChatStore } from "../store/chatStore";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface SidebarProps {
  onSelectTopic: (topicId: string) => void;

  currentTopic: string;

  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectTopic,
  currentTopic,
  isOpen,
}) => {
  const { topics, addTopic, updateTopicTitle, deleteTopic } = useChatStore();

  const [editingTopic, setEditingTopic] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState("");

  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const addNewTopic = () => {
    const newTopicId = Date.now().toString();

    const newTopicTitle = `New Topic ${Object.keys(topics).length + 1}`;

    addTopic(newTopicId, newTopicTitle);
  };

  const startEditing = (topicId: string, title: string) => {
    setEditingTopic(topicId);

    setEditTitle(title);
  };

  const saveEdit = (topicId: string) => {
    updateTopicTitle(topicId, editTitle);

    setEditingTopic(null);
  };

  const handleDeleteTopic = (topicId: string) => {
    deleteTopic(topicId);
  };

  if (!isOpen) {
    return null; // 如果侧边栏关闭，不渲染任何内容
  }

  return (
    <div className="bg-tech-dark-light h-full border-r border-tech-accent min-w-[256px] w-64 transition-all duration-300">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-tech-highlight">Topics</h2>
        <ul className="space-y-2">
          {Object.entries(topics).map(([topicId, messages]) => (
            <li
              key={topicId}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredTopic(topicId)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              {editingTopic === topicId ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveEdit(topicId)}
                  onKeyPress={(e) => e.key === "Enter" && saveEdit(topicId)}
                  className="bg-tech-dark text-tech-text p-1 rounded w-full"
                  autoFocus
                />
              ) : (
                <>
                  <span
                    className={`cursor-pointer hover:bg-tech-accent p-2 rounded transition-colors flex-grow ${
                      currentTopic === topicId ? "bg-tech-accent" : ""
                    }`}
                    onClick={() => onSelectTopic(topicId)}
                  >
                    {messages[0]?.content || `Topic ${topicId}`}
                  </span>
                  {hoveredTopic === topicId && (
                    <div className="absolute right-0 flex">
                      <button
                        onClick={() =>
                          startEditing(
                            topicId,
                            messages[0]?.content || `Topic ${topicId}`
                          )
                        }
                        className="ml-2 text-tech-highlight hover:text-tech-accent"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topicId)}
                        className="ml-2 text-tech-highlight hover:text-tech-accent"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-tech-accent text-tech-text px-4 py-2 rounded hover:bg-tech-highlight transition-colors w-full"
          onClick={addNewTopic}
        >
          Add New Topic
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
