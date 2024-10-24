'use client';

import React from 'react';
import { useChatStore } from '../store/chatStore';
import { useProjectStore } from '../store/projectStore';
import BAView from './BA/BAView';
import BackendView from './Backend/BackendView';
import FrontendView from './Frontend/FrontendView';
import PagesView from './Pages/PagesView';
import ProjectsView from './Projects/ProjectsView';
import Sidebar from './Sidebar/Sidebar';
import TestView from './Test/TestView';

import './Chat.scss';

const Chat: React.FC = () => {
  const { currentProject } = useProjectStore();
  const { currentView, setCurrentView } = useChatStore();

  const renderView = () => {
    switch (currentView) {
      case 'Projects':
        return <ProjectsView />;
      case 'Pages':
        return currentProject ? <PagesView projectId={currentProject.id} /> : null;
      case 'Frontend':
        return <FrontendView />;
      case 'Backend':
        return <BackendView />;
      case 'Tests':
        return <TestView />;
      case 'BA':
        return <BAView />;
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
