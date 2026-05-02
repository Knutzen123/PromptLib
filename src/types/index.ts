// TypeScript Interfaces für PromptLib

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  text: string;
  tags: string[];
  type: 'prompt' | 'agent';
  copyCount: number;
  createdAt: number;
  updatedAt: number;
  _autoType?: string | null;
  _autoTags?: string[];
}

export interface TagColor {
  bg: string;
  border: string;
  text: string;
}

export interface FuzzyMatch {
  tag: string;
  score: number;
  matches: [number, number][];
}

export interface FilterState {
  searchQuery: string;
  activeFilter: string;
  sortBy: SortOption;
  selectedIds: Set<string>;
}

export type SortOption = 'newest' | 'oldest' | 'alpha' | 'alpha-desc' | 'popular';

export interface FormState {
  editingId: string | null;
  title: string;
  description: string;
  text: string;
  tags: string[];
  isDirty: boolean;
}

export interface OllamaResponse {
  improved_text: string;
  suggested_tags: string[];
}

export type ToastType = 'normal' | 'undo' | 'warning' | 'full';

export interface ToastOptions {
  duration?: number;
  onUndo?: () => void;
}

export interface Draft {
  title: string;
  desc: string;
  text: string;
  tags: string[];
  editingId: string | null;
  timestamp: number;
}
