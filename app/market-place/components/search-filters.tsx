import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterState, SortOption } from '../types';

interface SearchFiltersProps {
  filters: FilterState;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onFrameworkToggle: (framework: string) => void;
  onTagToggle: (tag: string) => void;
  frameworks: string[];
  tags: ('requirement' | 'design' | 'FE' | 'BE' | 'Test')[];
}

export function SearchFilters({
  filters,
  onSearchChange,
  onSortChange,
  onFrameworkToggle,
  onTagToggle,
  frameworks,
  tags,
}: SearchFiltersProps) {
  const tagLabels = {
    requirement: '需求文档',
    design: '设计稿',
    FE: '前端',
    BE: '后端',
    Test: '测试',
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索组件..."
            className="pl-8"
            value={filters.searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Select onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">使用最多</SelectItem>
            <SelectItem value="recent">最新发布</SelectItem>
            <SelectItem value="name">名称</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frameworks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">按框架筛选:</h3>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((framework) => (
              <Badge
                key={framework}
                variant={filters.frameworks.includes(framework) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onFrameworkToggle(framework)}
              >
                {framework}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">按标签筛选:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => onTagToggle(tag)}
              >
                {tagLabels[tag]}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
