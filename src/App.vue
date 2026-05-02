<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PromptItem, SortOption } from './types';
import promptsData from './data/prompts.json';

// Components
import NavBar from './components/NavBar.vue';
import SearchInput from './components/SearchInput.vue';
import FilterBar from './components/FilterBar.vue';
import SortSelect from './components/SortSelect.vue';
import FilterCount from './components/FilterCount.vue';
import BulkToolbar from './components/BulkToolbar.vue';
import PromptCard from './components/PromptCard.vue';
import EmptyState from './components/EmptyState.vue';
import PromptForm from './components/PromptForm.vue';
import PromptDetail from './components/PromptDetail.vue';
import Overlay from './components/Overlay.vue';
import ThemeToggle from './components/ThemeToggle.vue';

// State
const items = ref<PromptItem[]>([]);
const searchQuery = ref('');
const activeFilter = ref<string>('all');
const sortBy = ref<SortOption>('newest');
const selectedIds = ref<Set<string>>(new Set());
const isDark = ref(false);

// UI State
const isFormOpen = ref(false);
const isDetailOpen = ref(false);
const editingId = ref<string | null>(null);
const detailId = ref<string | null>(null);

// Load initial data
onMounted(() => {
  // Use static JSON data as initial data source
  items.value = promptsData as PromptItem[];
  
  // Initialize theme
  const savedTheme = localStorage.getItem('promptlib_theme');
  if (savedTheme) {
    isDark.value = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true;
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

// Computed properties
const allTags = computed(() => {
  const tags = new Set<string>();
  items.value.forEach((item) => {
    item.tags.forEach((tag) => tags.add(tag));
  });
  return [...tags].sort();
});

const itemCounts = computed(() => {
  const threshold = getPopularThreshold();
  return {
    popular: items.value.filter((item) => (item.copyCount || 0) >= threshold && threshold > 0).length,
    all: items.value.length,
    agent: items.value.filter((item) => item.type === 'agent').length,
    prompt: items.value.filter((item) => item.type === 'prompt').length,
    byTag: {} as Record<string, number>
  };
});

const filteredItems = computed(() => {
  let result = [...items.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.includes(query))
    );
  }

  // Type/Tag filter
  if (activeFilter.value === 'agent') {
    result = result.filter((item) => item.type === 'agent');
  } else if (activeFilter.value === 'prompt') {
    result = result.filter((item) => item.type === 'prompt');
  } else if (activeFilter.value === 'popular') {
    const threshold = getPopularThreshold();
    result = result.filter((item) => (item.copyCount || 0) >= threshold && threshold > 0);
  } else if (activeFilter.value !== 'all') {
    result = result.filter((item) => item.tags.includes(activeFilter.value));
  }

  // Sorting
  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'oldest':
      result.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case 'alpha':
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'alpha-desc':
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'popular':
      result.sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0));
      break;
  }

  return result;
});

const currentItem = computed(() => {
  if (editingId.value) {
    return items.value.find((item) => item.id === editingId.value) || null;
  }
  return null;
});

const currentDetailItem = computed(() => {
  if (detailId.value) {
    return items.value.find((item) => item.id === detailId.value) || null;
  }
  return null;
});

// Helper functions
function getPopularThreshold(): number {
  if (items.value.length < 3) return 1;
  const counts = items.value
    .map((item) => item.copyCount || 0)
    .filter((c) => c > 0)
    .sort((a, b) => b - a);
  if (counts.length === 0) return 0;
  return Math.max(2, counts[Math.max(0, Math.floor(counts.length * 0.3))] || 1);
}

// Event handlers
function toggleTheme() {
  isDark.value = !isDark.value;
  const theme = isDark.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('promptlib_theme', theme);
}

function handleFilterChange(tag: string) {
  activeFilter.value = tag;
}

function handleSortChange(option: SortOption) {
  sortBy.value = option;
}

function handleSelect(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
}

function handleDetail(id: string) {
  detailId.value = id;
  isDetailOpen.value = true;
}

function handleEdit(id: string) {
  editingId.value = id;
  isFormOpen.value = true;
}

function handleCopy(id: string) {
  const item = items.value.find((i) => i.id === id);
  if (!item) return;

  navigator.clipboard.writeText(item.text).then(() => {
    item.copyCount = (item.copyCount || 0) + 1;
    alert('Kopiert!');
  });
}

function handleExport(id: string) {
  const item = items.value.find((i) => i.id === id);
  if (!item) return;

  const blob = new Blob([JSON.stringify([item], null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleSave(data: { title: string; description: string; text: string; tags: string[] }) {
  if (editingId.value) {
    // Update existing item
    const index = items.value.findIndex((item) => item.id === editingId.value);
    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        ...data,
        updatedAt: Date.now()
      };
    }
  } else {
    // Create new item
    const newItem: PromptItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      ...data,
      type: 'prompt',
      copyCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    items.value.unshift(newItem);
  }

  isFormOpen.value = false;
  editingId.value = null;
}

function handleDelete(id: string) {
  const index = items.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    items.value.splice(index, 1);
    isDetailOpen.value = false;
    detailId.value = null;
  }
}

function handleBulkExport() {
  // Export all items
  const blob = new Blob([JSON.stringify(items.value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `promptlib-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleBulkDelete() {
  items.value = items.value.filter((item) => !selectedIds.value.has(item.id));
  selectedIds.value.clear();
}

function handleClearSelection() {
  selectedIds.value.clear();
}

function handleCreateNew() {
  editingId.value = null;
  isFormOpen.value = true;
}

function handleImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target?.result as string);
      const dataArray = Array.isArray(importedData) ? importedData : [importedData];
      
      // Validate and add items
      let addedCount = 0;
      for (const item of dataArray) {
        if (item.title && item.text) {
          const newItem: PromptItem = {
            id: item.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            title: item.title,
            description: item.description || '',
            text: item.text,
            tags: item.tags || [],
            type: item.type || 'prompt',
            copyCount: item.copyCount || 0,
            createdAt: item.createdAt || Date.now(),
            updatedAt: Date.now()
          };
          items.value.unshift(newItem);
          addedCount++;
        }
      }
      
      if (addedCount > 0) {
        alert(`${addedCount} Eintrag${addedCount > 1 ? 'e' : ''} erfolgreich importiert!`);
      } else {
        alert('Keine gültigen Einträge gefunden.');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Fehler beim Importieren. Bitte stellen Sie sicher, dass die Datei ein gültiges JSON-Format hat.');
    }
  };
  reader.readAsText(file);
  
  // Reset input so the same file can be selected again
  target.value = '';
}
</script>

<template>
  <div class="app">
    <!-- Navigation -->
    <NavBar>
      <template #brand>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        PromptLib
      </template>
      <template #actions>
        <ThemeToggle :is-dark="isDark" @toggle="toggleTheme" />
      </template>
    </NavBar>

    <!-- Main Content -->
    <main class="container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-row">
          <h1>Meine Bibliothek</h1>
          <div class="hero-actions">
            <label class="btn btn-secondary" style="cursor: pointer;">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Importieren
              <input
                type="file"
                accept=".json"
                style="display: none;"
                @change="handleImport"
              />
            </label>
            <button class="btn btn-secondary" @click="handleBulkExport">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Alle exportieren
            </button>
            <button class="btn btn-primary" @click="handleCreateNew">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Neuer Eintrag
            </button>
          </div>
        </div>

        <SearchInput
          v-model="searchQuery"
          @search="() => {}"
        />
      </section>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <FilterBar
          :tags="allTags"
          :active-filter="activeFilter"
          :item-counts="itemCounts"
          @filter-change="handleFilterChange"
        />
        <div class="filter-sort-container">
          <SortSelect
            :sort-by="sortBy"
            @sort-change="handleSortChange"
          />
          <FilterCount
            :count="filteredItems.length"
            :total-count="items.length"
          />
        </div>
      </div>

      <!-- Bulk Toolbar -->
      <BulkToolbar
        :count="selectedIds.size"
        @export="handleBulkExport"
        @delete="handleBulkDelete"
        @clear="handleClearSelection"
      />

      <!-- Prompt Grid -->
      <div
        v-if="items.length === 0"
        class="empty-state-wrapper"
      >
        <EmptyState
          message="Deine Bibliothek ist leer."
          @create-new="handleCreateNew"
          @reset-filters="() => { activeFilter = 'all'; searchQuery = ''; }"
        />
      </div>
      <div
        v-else-if="filteredItems.length === 0"
        class="empty-state-wrapper"
      >
        <EmptyState
          message="Keine Einträge gefunden."
          :search-term="searchQuery || activeFilter"
          @reset-filters="() => { activeFilter = 'all'; searchQuery = ''; }"
          @create-new="handleCreateNew"
        />
      </div>
      <div
        v-else
        class="prompt-grid"
      >
        <PromptCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          :is-selected="selectedIds.has(item.id)"
          @select="handleSelect"
          @detail="handleDetail"
          @edit="handleEdit"
          @copy="handleCopy"
          @export="handleExport"
          @context-menu="() => {}"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div>Daten lokal im Browser. Kein Server, kein Tracking.</div>
      <div class="footer-links">
        <span>© 2025</span>
        <a href="#">Impressum</a>
        <a href="#">Datenschutz</a>
      </div>
    </footer>

    <!-- Overlays and Sidebars -->
    <Overlay
      :is-open="isFormOpen || isDetailOpen"
      @close="
        () => {
          isFormOpen = false;
          isDetailOpen = false;
          editingId = null;
          detailId = null;
        }
      "
    />

    <PromptForm
      :is-open="isFormOpen"
      :editing-id="editingId"
      :item="currentItem"
      @close="
        () => {
          isFormOpen = false;
          editingId = null;
        }
      "
      @save="handleSave"
    />

    <PromptDetail
      :is-open="isDetailOpen"
      :item="currentDetailItem"
      @close="
        () => {
          isDetailOpen = false;
          detailId = null;
        }
      "
      @copy="handleCopy"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<style>
@import './assets/styles.css';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-4) var(--spacing-3) var(--spacing-6);
  flex: 1;
}

.hero {
  margin-bottom: var(--spacing-3);
}

.hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
  flex-wrap: wrap;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.filter-sort-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.prompt-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--grid-gap);
}

@media (max-width: 600px) {
  .prompt-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state-wrapper {
  margin-top: var(--spacing-6);
}

.footer {
  border-top: 1px solid var(--color-border);
  padding: 24px var(--spacing-3);
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
  transition: border-color 0.25s ease;
}

.footer a {
  color: var(--color-text-muted);
  text-decoration: underline;
}

.footer a:hover {
  color: var(--color-text-primary);
}

.footer-links {
  margin-top: 4px;
  display: flex;
  gap: var(--spacing-2);
  justify-content: center;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-interactive);
  color: var(--color-bg);
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg);
  border-color: var(--color-text-muted);
}

.btn-destructive {
  background: var(--color-destructive);
  color: #fff;
}

.btn-destructive:hover {
  opacity: 0.85;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  padding: 6px 8px;
}

.btn-ghost:hover {
  color: var(--color-text-primary);
  background: var(--color-bg);
}

.btn-sm {
  padding: 4px 10px;
  font-size: 13px;
}

/* Tag Styles */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--tag-font-size, 12px);
  font-weight: var(--tag-font-weight, 500);
  line-height: var(--tag-line-height, 1.5);
  padding: var(--tag-padding, 3px 10px);
  border-radius: var(--tag-radius, 4px);
  border: 1px solid;
  transition: all 0.15s;
  white-space: nowrap;
}

.tag.type-tag {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #4b5563;
}

[data-theme='dark'] .tag.type-tag {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.shortcut-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
}
</style>
