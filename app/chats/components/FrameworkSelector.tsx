import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FrameworkSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function FrameworkSelector({ value, onValueChange }: FrameworkSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="mb-4">
        <SelectValue placeholder="Select Framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="React">React</SelectItem>
        <SelectItem value="Vue">Vue</SelectItem>
        <SelectItem value="Vanilla">Vanilla</SelectItem>
      </SelectContent>
    </Select>
  );
}
