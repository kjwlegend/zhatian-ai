import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ViewMode } from '../types/roadmap';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup type="single" value={view} onValueChange={(v) => onViewChange(v as ViewMode)}>
      <ToggleGroupItem value="overall" aria-label="View overall roadmap">
        总体开发计划
      </ToggleGroupItem>
      <ToggleGroupItem value="quarterly" aria-label="View quarterly roadmap">
        季度开发计划
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
