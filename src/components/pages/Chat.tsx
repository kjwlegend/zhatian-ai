import React, { useState } from "react";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ChatInterface from "../ChatInterface/ChatInterface";
import Sidebar from "../Sidebar/Sidebar";

const Chat: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<string>("Default Topic");
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      header={{ height: 60 }}
      styles={(theme) => ({
        main: {
          paddingTop: 60,
        },
      })}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Sidebar
          onSelectTopic={setCurrentTopic}
          currentTopic={currentTopic}
          isOpen={opened}
          toggleSidebar={toggle}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <ChatInterface currentTopic={currentTopic} />
      </AppShell.Main>
    </AppShell>
  );
};

export default Chat;
