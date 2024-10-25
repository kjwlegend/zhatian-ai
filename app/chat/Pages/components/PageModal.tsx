import React from 'react';
import { IconEdit, IconSettings } from '@tabler/icons-react';
import { Button, Modal, Select, Switch, Tabs, Text, TextInput } from '@mantine/core';
import { MockPage } from '../types';

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: MockPage | null;
  onSave: (page: MockPage) => void;
  onDelete: (id: string) => void;
}

export const PageModal: React.FC<PageModalProps> = ({
  isOpen,
  onClose,
  page,
  onSave,
  onDelete,
}) => {
  const [editedPage, setEditedPage] = React.useState<MockPage | null>(page);

  React.useEffect(() => {
    setEditedPage(page);
  }, [page]);

  if (!editedPage) return null;

  const handleSave = () => {
    onSave(editedPage);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Page Details" size="xl">
      <Tabs defaultValue="info">
        <Tabs.List>
          <Tabs.Tab value="info" icon={<IconEdit size="0.8rem" />}>
            Page Info
          </Tabs.Tab>
          <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="info" pt="xs">
          <TextInput
            label="Page Name"
            value={editedPage.name}
            onChange={(e) => setEditedPage({ ...editedPage, name: e.target.value })}
            mb="md"
          />
          <TextInput
            label="Page Description"
            value={editedPage.description}
            onChange={(e) => setEditedPage({ ...editedPage, description: e.target.value })}
            mb="md"
          />
          <Select
            label="Page Type"
            data={[
              { value: 'static', label: 'Static' },
              { value: 'dynamic', label: 'Dynamic' },
            ]}
            value={editedPage.type}
            onChange={(value) => setEditedPage({ ...editedPage, type: value || '' })}
            mb="md"
          />
          <Text size="sm" mb="md">
            Components: {editedPage.componentsCount}
          </Text>
          <Text size="sm" mb="md">
            Last updated: {new Date(editedPage.lastUpdated).toLocaleString()}
          </Text>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xs">
          <Button color="red" onClick={() => onDelete(editedPage.id)} fullWidth mt="xl">
            Delete Page
          </Button>
        </Tabs.Panel>
      </Tabs>
      <Button onClick={handleSave} fullWidth mt="md">
        Save Changes
      </Button>
    </Modal>
  );
};
