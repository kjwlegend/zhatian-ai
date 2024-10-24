'use client';

import React, { useState } from 'react';
import BackendView from './Backend/BackendView';
import FrontendView from './Frontend/FrontendView';
import PagesView from './Pages/PagesView';
import ProjectsView from './Projects/ProjectsView';
import Sidebar from './Sidebar/Sidebar';
import TestView from './Test/TestView';

import './Chat.scss';

const Chat: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('Projects');

  const renderView = () => {
    switch (currentView) {
      case 'Projects':
        return <ProjectsView />;
      case 'Pages':
        return <PagesView />;
      case 'Frontend':
        return <FrontendView />;
      case 'Backend':
        return <BackendView />;
      case 'Tests':
        return <TestView />;
      default:
        return <ProjectsView />;
    }
  };

  return (
    <div className="chat-container">
      <Sidebar onSelectView={setCurrentView} currentView={currentView} />
      <main className="chat-main">{renderView()}</main>
    </div>
  );
};

export default Chat;
