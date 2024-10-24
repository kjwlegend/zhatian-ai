import React from 'react';
import { IconDoorEnter, IconEye } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Text } from '@mantine/core';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: () => void;
  onEnterProject: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onEnterProject,
}) => (
  <Card shadow="sm" p="lg" radius="md" withBorder className="project-card">
    <Card.Section className="project-card__header">
      <Text weight={500} size="lg">
        {project.name}
      </Text>
      <Badge color="blue" variant="light">
        {project.codeType}
      </Badge>
    </Card.Section>
    <Text size="sm" color="dimmed" lineClamp={2} mt="xs">
      {project.description}
    </Text>
    <Group position="apart" mt="md">
      <Text size="sm">Pages: {project.pagesCount}</Text>
      <Text size="sm">Components: {project.componentsCount}</Text>
    </Group>
    <Text size="xs" color="dimmed" mt="md">
      Created by {project.creator} on {project.createdAt}
    </Text>
    <Group position="apart" mt="xl">
      <Button variant="light" leftIcon={<IconEye size={14} />} onClick={onViewDetails}>
        View Details
      </Button>
      <Button color="blue" leftIcon={<IconDoorEnter size={14} />} onClick={onEnterProject}>
        Enter Project
      </Button>
    </Group>
  </Card>
);
