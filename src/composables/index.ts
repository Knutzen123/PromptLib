import { ref, computed, type Ref } from 'vue';
import type { PromptItem, SortOption } from '../types';
import { STORAGE_KEYS, DEFAULT_COPY_THRESHOLD_PERCENTILE, MIN_COPY_THRESHOLD } from '../constants';

/**
 * Composable für die Verwaltung von Prompts
 */
export function usePrompts() {
  const items = ref<PromptItem[]>([]) as Ref<PromptItem[]>;

  /**
   * Lädt die initialen Daten
   */
  function loadInitialData(data: PromptItem[]) {
    items.value = data;
  }

  /**
   * Fügt einen neuen Prompt hinzu
   */
  function addPrompt(prompt: Omit<PromptItem, 'id' | 'copyCount' | 'createdAt' | 'updatedAt'>) {
    const newPrompt: PromptItem = {
      ...prompt,
      id: generateId(),
      copyCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    items.value.unshift(newPrompt);
    return newPrompt;
  }

  /**
   * Aktualisiert einen bestehenden Prompt
   */
  function updatePrompt(id: string, updates: Partial<Omit<PromptItem, 'id' | 'createdAt'>>) {
    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        ...updates,
        updatedAt: Date.now()
      };
      return true;
    }
    return false;
  }

  /**
   * Löscht einen Prompt
   */
  function deletePrompt(id: string) {
    const index = items.value.findIndex(item => item.id === id);
    if (index !== -1) {
      items.value.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Erhöht den Kopierzähler
   */
  function incrementCopyCount(id: string) {
    const prompt = items.value.find(item => item.id === id);
    if (prompt) {
      prompt.copyCount = (prompt.copyCount || 0) + 1;
      return true;
    }
    return false;
  }

  /**
   * Löscht mehrere Prompts auf einmal
   */
  function bulkDelete(ids: Set<string>) {
    items.value = items.value.filter(item => !ids.has(item.id));
  }

  /**
   * Generiert eine eindeutige ID
   */
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  return {
    items,
    loadInitialData,
    addPrompt,
    updatePrompt,
    deletePrompt,
    incrementCopyCount,
    bulkDelete
  };
}

/**
 * Composable für Filter- und Suchfunktionen
 */
export function useFilters(items: Ref<PromptItem[]>) {
  const searchQuery = ref('');
  const activeFilter = ref<string>('all');
  const sortBy = ref<SortOption>('newest');
  const selectedIds = ref<Set<string>>(new Set());

  /**
   * Berechnet alle verfügbaren Tags
   */
  const allTags = computed(() => {
    const tags = new Set<string>();
    items.value.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return [...tags].sort();
  });

  /**
   * Berechnet die Anzahl der Items pro Kategorie
   */
  const itemCounts = computed(() => {
    const threshold = getPopularThreshold();
    return {
      popular: items.value.filter(item => (item.copyCount || 0) >= threshold && threshold > 0).length,
      all: items.value.length,
      agent: items.value.filter(item => item.type === 'agent').length,
      prompt: items.value.filter(item => item.type === 'prompt').length,
      byTag: {} as Record<string, number>
    };
  });

  /**
   * Gefilterte und sortierte Liste der Prompts
   */
  const filteredItems = computed(() => {
    let result = [...items.value];

    // Suchfilter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.text.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.includes(query))
      );
    }

    // Typ/Tag Filter
    if (activeFilter.value === 'agent') {
      result = result.filter(item => item.type === 'agent');
    } else if (activeFilter.value === 'prompt') {
      result = result.filter(item => item.type === 'prompt');
    } else if (activeFilter.value === 'popular') {
      const threshold = getPopularThreshold();
      result = result.filter(item => (item.copyCount || 0) >= threshold && threshold > 0);
    } else if (activeFilter.value !== 'all') {
      result = result.filter(item => item.tags.includes(activeFilter.value));
    }

    // Sortierung
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'alpha':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        case 'popular':
          return (b.copyCount || 0) - (a.copyCount || 0);
        default:
          return 0;
      }
    });

    return result;
  });

  /**
   * Berechnet den Threshold für "populäre" Items
   */
  function getPopularThreshold(): number {
    if (items.value.length < 3) return 1;
    const counts = items.value
      .map(item => item.copyCount || 0)
      .filter(c => c > 0)
      .sort((a, b) => b - a);
    if (counts.length === 0) return 0;
    const index = Math.max(0, Math.floor(counts.length * DEFAULT_COPY_THRESHOLD_PERCENTILE));
    return Math.max(MIN_COPY_THRESHOLD, counts[index] || 1);
  }

  /**
   * Wählt ein Item aus oder hebt die Auswahl auf
   */
  function toggleSelection(id: string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id);
    } else {
      selectedIds.value.add(id);
    }
  }

  /**
   * Hebt alle Auswahl auf
   */
  function clearSelection() {
    selectedIds.value.clear();
  }

  /**
   * Setzt die Filtersuche zurück
   */
  function resetFilters() {
    activeFilter.value = 'all';
    searchQuery.value = '';
  }

  return {
    searchQuery,
    activeFilter,
    sortBy,
    selectedIds,
    allTags,
    itemCounts,
    filteredItems,
    toggleSelection,
    clearSelection,
    resetFilters
  };
}

/**
 * Composable für Theme-Management
 */
export function useTheme() {
  const isDark = ref(false);

  /**
   * Initialisiert das Theme aus LocalStorage oder Systemeinstellung
   */
  function initializeTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
      applyTheme(savedTheme as 'dark' | 'light');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark.value = true;
      applyTheme('dark');
    }
  }

  /**
   * Wendet das Theme an
   */
  function applyTheme(theme: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Wechselt das Theme
   */
  function toggleTheme() {
    isDark.value = !isDark.value;
    const theme = isDark.value ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  return {
    isDark,
    initializeTheme,
    toggleTheme
  };
}

/**
 * Composable für UI-Zustände (Modals, Sidebars, etc.)
 */
export function useUI() {
  const isFormOpen = ref(false);
  const isDetailOpen = ref(false);
  const editingId = ref<string | null>(null);
  const detailId = ref<string | null>(null);

  /**
   * Öffnet das Formular zum Bearbeiten
   */
  function openEditForm(id: string) {
    editingId.value = id;
    isFormOpen.value = true;
  }

  /**
   * Öffnet das Formular zum Erstellen
   */
  function openCreateForm() {
    editingId.value = null;
    isFormOpen.value = true;
  }

  /**
   * Öffnet die Detailansicht
   */
  function openDetail(id: string) {
    detailId.value = id;
    isDetailOpen.value = true;
  }

  /**
   * Schließt alle offenen Dialoge
   */
  function closeAll() {
    isFormOpen.value = false;
    isDetailOpen.value = false;
    editingId.value = null;
    detailId.value = null;
  }

  return {
    isFormOpen,
    isDetailOpen,
    editingId,
    detailId,
    openEditForm,
    openCreateForm,
    openDetail,
    closeAll
  };
}
