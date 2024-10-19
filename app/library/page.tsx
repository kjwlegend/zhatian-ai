'use client';
import React, { useState } from 'react';
import { Container, TextInput, Badge, Card, Text, Stack, Avatar, Pagination, Flex } from '@mantine/core';
import { IconSearch, IconCode, IconFlame } from '@tabler/icons-react';
import './Library.scss';

// 模拟组件数据
const mockComponents = Array(200).fill(null).map((_, index) => ({
  id: `component-${index}`,
  name: `Component ${index + 1}`,
  description: `This is a description for Component ${index + 1}`,
  tags: ['React', 'UI', index % 2 === 0 ? 'Form' : 'Layout'],
  creator: `User ${index % 10 + 1}`,
  usageCount: Math.floor(Math.random() * 1000),
}));

const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 80;

  const allTags = Array.from(new Set(mockComponents.flatMap(c => c.tags)));

  const filteredComponents = mockComponents.filter(component => 
    component.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTags.length === 0 || selectedTags.some(tag => component.tags.includes(tag)))
  );

  const paginatedComponents = filteredComponents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const ComponentCard: React.FC<typeof mockComponents[0]> = ({ name, description, tags, creator, usageCount }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="library__card">
      <Card.Section className="library__card-content">
        <Stack spacing="xs">
          <Flex justify="space-between" align="center">
            <Text size="lg" weight={500}>{name}</Text>
            <Badge leftSection={<IconFlame size={14} />} color="pink" variant="light">
              {usageCount}
            </Badge>
          </Flex>
          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </Stack>
      </Card.Section>

      <Card.Section className="library__card-footer">
        <Flex justify="space-between" align="center" mt="md">
          <Flex align="center" gap="xs">
            <Avatar size={24} radius="xl" />
            <Text size="sm">{creator}</Text>
          </Flex>
          <IconCode size={20} />
        </Flex>
        <Flex mt="md" gap="xs" wrap="wrap">
          {tags.map(tag => (
            <Badge key={tag} size="sm" variant="outline">
              {tag}
            </Badge>
          ))}
        </Flex>
      </Card.Section>
    </Card>
  );

  return (
    <Container size="xl" className="library">
      <TextInput
        placeholder="Search components"
        leftSection={<IconSearch size={14} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        className="library__search"
      />

      <div className="library__tags">
        {allTags.map(tag => (
          <Badge
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`library__tag ${selectedTags.includes(tag) ? 'library__tag--active' : ''}`}
            variant={selectedTags.includes(tag) ? 'filled' : 'outline'}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="library__grid">
        {paginatedComponents.map(component => (
          <ComponentCard key={component.id} {...component} />
        ))}
      </div>

      <Pagination
        total={Math.ceil(filteredComponents.length / itemsPerPage)}
        value={currentPage}
        onChange={setCurrentPage}
        className="library__pagination"
      />
    </Container>
  );
};

export default Library;
