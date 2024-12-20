'use client';

import { Loader2 } from 'lucide-react';
import { ComponentCard } from './components/component-card';
import { SearchFilters } from './components/search-filters';
import { useComponentActions } from './hooks/useComponentActions';
import { useMarketplace } from './hooks/useMarketplace';

export default function ComponentMarketplace() {
  const {
    components,
    loading,
    filters,
    availableFrameworks,
    availableTags,
    toggleFramework,
    toggleTag,
    setSearchQuery,
    setSortBy,
  } = useMarketplace();

  const { handleStartChat, handleAddToProject, loading: actionLoading } = useComponentActions();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
      <SearchFilters
        filters={filters}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onFrameworkToggle={toggleFramework}
        onTagToggle={toggleTag}
        frameworks={availableFrameworks}
        tags={availableTags}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {components.map((component) => (
          <ComponentCard
            key={component.id}
            component={component}
            onStartChat={() => handleStartChat(component)}
            onAddToProject={() => handleAddToProject(component)}
          />
        ))}
      </div>
    </div>
  );
}
