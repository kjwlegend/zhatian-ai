import React, { useState } from "react";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<string>("Default Topic");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-tech-dark text-tech-text">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <Sidebar
            onSelectTopic={(topicId) => setCurrentTopic(topicId)}
            currentTopic={currentTopic}
          />
        )}
        <main className="flex-grow flex flex-col">
          <ChatInterface currentTopic={currentTopic} />
        </main>
      </div>
    </div>
  );
};

export default App;
