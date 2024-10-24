'use client';

import { useEffect, useState } from 'react';
import {
  IconClipboardList,
  IconDatabase,
  IconEdit,
  IconFileFilled,
  IconHome2,
  IconListDetails,
  IconPlus,
  IconTrash,
  IconWebhook,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Group,
  ScrollArea,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { ChatTopic, ChatView } from '../../services/db/schema';
import { useChatStore } from '../../store/chatStore';

import './Sidebar.scss';

const mainLinksMockdata = [
  { icon: IconHome2, label: 'Projects' },
  { icon: IconFileFilled, label: 'Pages' },
  { icon: IconWebhook, label: 'Frontend' },
  { icon: IconDatabase, label: 'Backend' },
  { icon: IconListDetails, label: 'Tests' },
  { icon: IconClipboardList, label: 'BA' },
];

interface SidebarProps {
  onSelectView: (view: string) => void;
  currentView: string;
}

export function Sidebar({ onSelectView, currentView }: SidebarProps) {
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [editingTopicName, setEditingTopicName] = useState('');
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const { addTopic, deleteTopic, updateTopicTitle, getViewTopics, setCurrentTopic, currentTopic } =
    useChatStore();

  useEffect(() => {
    const loadTopics = async () => {
      if (currentView && ['Frontend', 'Backend', 'Tests', 'BA'].includes(currentView)) {
        const loadedTopics = await getViewTopics(currentView);
        setTopics(loadedTopics);
      } else {
        setTopics([]);
      }
    };
    loadTopics();
  }, [currentView, getViewTopics, currentTopic]); // Add currentTopic as a dependency

  const handleAddTopic = async () => {
    if (newTopicName.trim() && currentView) {
      const topicId = await addTopic(currentView, newTopicName.trim());
      setNewTopicName('');
      const updatedTopics = await getViewTopics(currentView);
      setTopics(updatedTopics);
      setActiveTopic(topicId);
      setCurrentTopic(topicId);
    }
  };

  const handleUpdateTopic = async (topicId: string, newName: string) => {
    if (newName.trim() && newName !== topics.find((t) => t.id === topicId)?.title) {
      await updateTopicTitle(topicId, newName.trim());
      setEditingTopic(null);
      const updatedTopics = await getViewTopics(currentView);
      setTopics(updatedTopics);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    await deleteTopic(currentView, topicId);
    const updatedTopics = await getViewTopics(currentView);
    setTopics(updatedTopics);
    if (activeTopic === topicId) {
      setActiveTopic(null);
      setCurrentTopic('');
    }
  };

  const mainLinks = mainLinksMockdata.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        onClick={() => {
          onSelectView(link.label);
          setActiveTopic(null);
          setCurrentTopic(''); // Clear currentTopic when selecting a new view
        }}
        className="mainLink"
        data-active={link.label === currentView || undefined}
      >
        <link.icon style={{ width: '22px', height: '22px' }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  const topicLinks = topics.map((topic) => (
    <div key={topic.id} className="topic-item">
      {editingTopic === topic.id ? (
        <TextInput
          value={editingTopicName}
          onChange={(event) => setEditingTopicName(event.currentTarget.value)}
          onBlur={() => handleUpdateTopic(topic.id, editingTopicName)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleUpdateTopic(topic.id, editingTopicName);
            }
          }}
          autoFocus
        />
      ) : (
        <>
          <UnstyledButton
            onClick={() => {
              setActiveTopic(topic.id);
              setCurrentTopic(topic.id);
            }}
            className="topic-button"
            data-active={activeTopic === topic.id || undefined}
          >
            {topic.title}
          </UnstyledButton>
          <div className="topic-actions">
            <ActionIcon
              onClick={() => {
                setEditingTopic(topic.id);
                setEditingTopicName(topic.title);
              }}
            >
              <IconEdit size="1rem" />
            </ActionIcon>
            <ActionIcon onClick={() => handleDeleteTopic(topic.id)} color="red">
              <IconTrash size="1rem" />
            </ActionIcon>
          </div>
        </>
      )}
    </div>
  ));

  const showTopics = ['Frontend', 'Backend', 'Tests', 'BA'].includes(currentView);

  return (
    <nav className="navbar">
      <div className="wrapper">
        <div className="aside">{mainLinks}</div>
        <div className="main">
          <Title order={4} className="title">
            {currentView}
          </Title>
          {showTopics && (
            <>
              <ScrollArea className="topic-list" scrollbarSize={6} my="md">
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
