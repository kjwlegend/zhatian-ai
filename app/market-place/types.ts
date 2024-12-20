export interface MarketComponent {
  id: string;
  name: string;
  description: string;
  codeFramework: string;
  tags: ('requirement' | 'design' | 'FE' | 'BE' | 'Test')[];
  thumbnail: string;
  usage?: number;
  creator: string;
  verified: boolean;
  published: boolean;
  createdAt: number;
  updatedAt: number;
  status: 'draft' | 'Done';
  designFile: string;
  code: {
    frontend: Record<string, string>;
    backend: Record<string, string>;
    test: Record<string, string>;
  };
  componentDoc: string;
  version: string;
  dependencies?: string[];
}

export interface ComponentCode {
  frontend: Record<string, string>;
  backend: Record<string, string>;
  test: Record<string, string>;
}

export interface ComponentStats {
  totalUsage: number;
  projectsCount: number;
  averageRating: number;
  lastUpdated: string;
}

export type SortOption = 'downloads' | 'recent' | 'name';

export interface FilterState {
  frameworks: string[];
  tags: string[];
  searchQuery: string;
  sortBy: SortOption;
}
