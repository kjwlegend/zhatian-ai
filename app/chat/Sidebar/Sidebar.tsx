'use client'
import { useState } from 'react';
import { UnstyledButton, Tooltip, Title, rem, TextInput, ActionIcon, Group, ScrollArea } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconCalendarStats,
  IconUser,
  IconFingerprint,
  IconSettings,
  IconPlus,
  IconTrash,
  IconEdit,
} from '@tabler/icons-react';
import { useChatStore } from '../../store/chatStore';
import './Sidebar.scss'

const mainLinksMockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

interface DoubleNavbarProps {
  onSelectTopic: (topic: string) => void;
  currentTopic: string;
}

export function DoubleNavbar({ onSelectTopic, currentTopic }: DoubleNavbarProps) {
  const [active, setActive] = useState('Topics');
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  const { topics, addTopic, deleteTopic, updateTopicTitle } = useChatStore();

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => setActive(link.label)}
        className="mainLink"
        data-active={link.label === active || undefined}
      >
        <link.icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const handleAddTopic = () => {
    if (newTopicName.trim()) {
      const topicId = Date.now().toString(); // 生成一个唯一的 ID
      addTopic(topicId, newTopicName.trim());
      setNewTopicName('');
      onSelectTopic(topicId); // 选择新创建的主题
    }
  };

  const handleUpdateTopic = (topicId: string, newName: string) => {
    if (newName.trim() && newName !== topics[topicId][0].content) {
      updateTopicTitle(topicId, newName.trim());
    }
    setEditingTopic(null);
  };

  const topicLinks = Object.entries(topics).map(([topicId, messages]) => (
    <div key={topicId} className="topic-item">
      {editingTopic === topicId ? (
        <TextInput
          value={newTopicName}
          onChange={(event) => setNewTopicName(event.currentTarget.value)}
          onBlur={() => handleUpdateTopic(topicId, newTopicName)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleUpdateTopic(topicId, newTopicName);
            }
          }}
          autoFocus
        />
      ) : (
        <>
          <UnstyledButton
            onClick={() => {
              setActive(topicId);
              onSelectTopic(topicId);
            }}
            className="topic-button"
            data-active={currentTopic === topicId || undefined}
          >
            {messages[0].content}
          </UnstyledButton>
          <div className="topic-actions">
            <ActionIcon onClick={() => {
              setEditingTopic(topicId);
              setNewTopicName(messages[0].content);
            }}>
              <IconEdit size="1rem" />
            </ActionIcon>
            <ActionIcon onClick={() => {
              deleteTopic(topicId);
              if (currentTopic === topicId) {
                const remainingTopics = Object.keys(topics).filter(id => id !== topicId);
                if (remainingTopics.length > 0) {
                  onSelectTopic(remainingTopics[0]);
                } else {
                  onSelectTopic('');
                }
              }
            }} color="red">
              <IconTrash size="1rem" />
            </ActionIcon>
          </div>
        </>
      )}
    </div>
  ));

  return (
    <nav className="navbar">
      <div className="wrapper">
        <div className="aside">
          {mainLinks}
        </div>
        <div className="main">
          <Title order={4} className="title">
            {active}
          </Title>
          <ScrollArea className="topic-list" scrollbarSize={6}  my="md">
            {topicLinks}
          </ScrollArea>

          <Group className="addTopic" wrap="nowrap">
            <TextInput
              placeholder="New topic"
              value={newTopicName}
              onChange={(event) => setNewTopicName(event.currentTarget.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleAddTopic();
                }
              }}
            />
            <ActionIcon onClick={handleAddTopic} color="blue">
              <IconPlus size="1rem" />
            </ActionIcon>
          </Group>
        </div>
      </div>
    </nav>
  );
}

export default DoubleNavbar;
