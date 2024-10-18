import React from "react";
import { Box, Text, Button, ActionIcon, ScrollArea } from "@mantine/core";
import { useChatStore } from "../../store/chatStore";
import {
  IconPencil,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconMessageCircle2,
} from "@tabler/icons-react";

interface SidebarProps {
  onSelectTopic: (topicId: string) => void;
  currentTopic: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectTopic,
  currentTopic,
  isOpen,
  toggleSidebar,
}) => {
  const { topics, addTopic, updateTopicTitle, deleteTopic } = useChatStore();
  const [editingTopic, setEditingTopic] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");

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

  return (
    <Box style={{ height: "100%", position: "relative" }}>
      <ActionIcon
        onClick={toggleSidebar}
        style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}
      >
        {isOpen ? (
          <IconChevronLeft size={24} />
        ) : (
          <IconChevronRight size={24} />
        )}
      </ActionIcon>
      {isOpen ? (
        <ScrollArea style={{ height: "100%", padding: "1rem" }}>
          <Text size="lg" weight={700} mb="md">
            Topics
          </Text>
          {Object.entries(topics).map(([topicId, messages]) => (
            <Box key={topicId} mb="sm">
              {editingTopic === topicId ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveEdit(topicId)}
                  onKeyPress={(e) => e.key === "Enter" && saveEdit(topicId)}
                  style={{ width: "100%", padding: "0.5rem" }}
                  autoFocus
                />
              ) : (
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem",
                    backgroundColor:
                      currentTopic === topicId
                        ? "var(--mantine-color-blue-1)"
                        : "transparent",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                  }}
                  onClick={() => onSelectTopic(topicId)}
                >
                  <Text>{messages[0]?.content || `Topic ${topicId}`}</Text>
                  <Box>
                    <ActionIcon
                      onClick={() =>
                        startEditing(
                          topicId,
                          messages[0]?.content || `Topic ${topicId}`
                        )
                      }
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon onClick={() => handleDeleteTopic(topicId)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          <Button fullWidth onClick={addNewTopic} mt="md">
            Add New Topic
          </Button>
        </ScrollArea>
      ) : (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <IconMessageCircle2 size={24} />
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;
