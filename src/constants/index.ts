// Konstanten für die PromptLib Anwendung

export const SORT_OPTIONS = {
  NEWEST: 'newest' as const,
  OLDEST: 'oldest' as const,
  ALPHA: 'alpha' as const,
  ALPHA_DESC: 'alpha-desc' as const,
  POPULAR: 'popular' as const
};

export const FILTER_TYPES = {
  ALL: 'all' as const,
  PROMPT: 'prompt' as const,
  AGENT: 'agent' as const,
  POPULAR: 'popular' as const
};

export const STORAGE_KEYS = {
  THEME: 'promptlib_theme',
  DRAFT: 'promptlib_draft'
};

export const DEFAULT_COPY_THRESHOLD_PERCENTILE = 0.3;
export const MIN_COPY_THRESHOLD = 2;

export const ITEM_TYPES = {
  PROMPT: 'prompt' as const,
  AGENT: 'agent' as const
};

export const TOAST_TYPES = {
  NORMAL: 'normal' as const,
  UNDO: 'undo' as const,
  WARNING: 'warning' as const,
  FULL: 'full' as const
};
