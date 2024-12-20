import { useEffect, useState } from 'react';
import { getAllComponents } from '@/app/services/db/componentsService';
import { FilterState, MarketComponent, SortOption } from '../types';

export function useMarketplace() {
  const [components, setComponents] = useState<MarketComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    frameworks: [],
    tags: [],
    searchQuery: '',
    sortBy: 'downloads' as SortOption,
  });

  const availableFrameworks = Array.from(
    new Set(components.map((comp) => comp.codeFramework))
  ).sort();

  const availableTags = Array.from(new Set(components.flatMap((comp) => comp.tags))).sort();

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const data = await getAllComponents({ published: true });
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFramework = (framework: string) => {
    setFilters((prev) => ({
      ...prev,
      frameworks: prev.frameworks.includes(framework)
        ? prev.frameworks.filter((f) => f !== framework)
        : [...prev.frameworks, framework],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const setSearchQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  const setSortBy = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const filteredComponents = components
    .filter((component) => {
      const matchesFramework =
        filters.frameworks.length === 0 || filters.frameworks.includes(component.codeFramework);
      const matchesTags =
        filters.tags.length === 0 || component.tags.some((tag) => filters.tags.includes(tag));
      const matchesSearch =
        component.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchesFramework && matchesTags && matchesSearch;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'downloads':
          return (b.usage || 0) - (a.usage || 0);
        case 'recent':
          return b.createdAt - a.createdAt;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return {
    components: filteredComponents,
    loading,
    filters,
    availableFrameworks,
    availableTags,
    toggleFramework,
    toggleTag,
    setSearchQuery,
    setSortBy,
  };
}
