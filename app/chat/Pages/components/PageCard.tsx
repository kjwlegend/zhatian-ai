import React from 'react';
import { IconDoorEnter, IconEye } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Text } from '@mantine/core';
import { MockPage } from '../types';

interface PageCardProps {
  page: MockPage;
  onViewDetails: () => void;
  onEnterPage: () => void;
}

export const PageCard: React.FC<PageCardProps> = ({ page, onViewDetails, onEnterPage }) => (
  <Card shadow="sm" p="lg" radius="md" withBorder className="page-card">
    <Card.Section className="page-card__header">
      <Text weight={500} size="lg">
        {page.name}
      </Text>
      <Badge color="blue" variant="light">
        {page.type}
      </Badge>
    </Card.Section>
    <Text size="sm" color="dimmed" lineClamp={2} mt="xs">
      {page.description}
    </Text>
    <Group position="apart" mt="md">
      <Text size="sm">Components: {page.componentsCount}</Text>
    </Group>
    <Text size="xs" color="dimmed" mt="md">
      Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
    </Text>
    <Group position="apart" mt="xl">
      <Button variant="light" leftIcon={<IconEye size={14} />} onClick={onViewDetails}>
        View Details
      </Button>
      <Button color="blue" leftIcon={<IconDoorEnter size={14} />} onClick={onEnterPage}>
        Enter Page
      </Button>
    </Group>
  </Card>
);
