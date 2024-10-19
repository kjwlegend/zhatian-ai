'use client'
import React, { useState } from "react";
import ChatInterface from "./ChatInterface/ChatInterface";
import Sidebar from "./Sidebar/Sidebar";
import "./Chat.scss"; // 导入新的 CSS 文件

const Chat: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<string>("");

  return (
    <div className="chat-container">
      <Sidebar
        onSelectTopic={setCurrentTopic}
        currentTopic={currentTopic}
      />
      <main className="chat-main">
        <ChatInterface currentTopic={currentTopic} />
      </main>
    </div>
  );
};

export default Chat;
