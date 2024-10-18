import React, { useState } from "react";
import { AppShell } from "@mantine/core";
import ChatInterface from "../components/ChatInterface/ChatInterface";
import Sidebar from "../components/Sidebar/Sidebar";

const Chat: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<string>("Default Topic");
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
    >
      <AppShell.Navbar>
        <Sidebar
          onSelectTopic={setCurrentTopic}
          currentTopic={currentTopic}
          isOpen={opened}
          toggleSidebar={() => setOpened((o) => !o)}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <ChatInterface currentTopic={currentTopic} />
      </AppShell.Main>
    </AppShell>
  );
};

export default Chat;
