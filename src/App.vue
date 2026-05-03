<script setup lang="ts">
import { onMounted, computed } from 'vue';
import type { PromptItem, SortOption } from './types';
import promptsData from './data/prompts.json';

// Composables
import { usePrompts, useFilters, useTheme, useUI } from './composables';
import { downloadBlob, copyToClipboard, sanitizeFilename } from './utils/helpers';

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

// Composables initialisieren
const { items, loadInitialData, addPrompt, updatePrompt, deletePrompt, incrementCopyCount, bulkDelete } = usePrompts();
const { searchQuery, activeFilter, sortBy, selectedIds, allTags, itemCounts, filteredItems, toggleSelection, clearSelection, resetFilters } = useFilters(items);
const { isDark, initializeTheme, toggleTheme } = useTheme();
const { isFormOpen, isDetailOpen, editingId, detailId, openEditForm, openCreateForm, openDetail, closeAll } = useUI();

// Load initial data
onMounted(() => {
  // Use static JSON data as initial data source
  loadInitialData(promptsData as PromptItem[]);
  
  // Initialize theme
  initializeTheme();
});

// Computed properties
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

// Event handlers
function handleFilterChange(tag: string) {
  activeFilter.value = tag;
}

function handleSortChange(option: SortOption) {
  sortBy.value = option;
}

function handleCopy(id: string) {
  const item = items.value.find((i) => i.id === id);
  if (!item) return;

  copyToClipboard(item.text).then(() => {
    incrementCopyCount(id);
    alert('Kopiert!');
  });
}

function handleExport(id: string) {
  const item = items.value.find((i) => i.id === id);
  if (!item) return;

  const filename = `${sanitizeFilename(item.title)}.json`;
  downloadBlob([item], filename);
}

function handleSave(data: { title: string; description: string; text: string; tags: string[] }) {
  if (editingId.value) {
    // Update existing item
    updatePrompt(editingId.value, data);
  } else {
    // Create new item
    addPrompt({
      ...data,
      type: 'prompt'
    });
  }

  isFormOpen.value = false;
  editingId.value = null;
}

function handleBulkExport() {
  const filename = `promptlib-export-${new Date().toISOString().slice(0, 10)}.json`;
  downloadBlob(items.value, filename);
}

function handleBulkDelete() {
  bulkDelete(selectedIds.value);
  clearSelection();
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
          addPrompt({
            title: item.title,
            description: item.description || '',
            text: item.text,
            tags: item.tags || [],
            type: item.type || 'prompt'
          });
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
            <button class="btn btn-primary" @click="openCreateForm">
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
        @clear="clearSelection"
      />

      <!-- Prompt Grid -->
      <div
        v-if="items.length === 0"
        class="empty-state-wrapper"
      >
        <EmptyState
          message="Deine Bibliothek ist leer."
          @create-new="openCreateForm"
          @reset-filters="resetFilters"
        />
      </div>
      <div
        v-else-if="filteredItems.length === 0"
        class="empty-state-wrapper"
      >
        <EmptyState
          message="Keine Einträge gefunden."
          :search-term="searchQuery || activeFilter"
          @reset-filters="resetFilters"
          @create-new="openCreateForm"
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
          @select="toggleSelection"
          @detail="openDetail"
          @edit="openEditForm"
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
      @close="closeAll"
    />

    <PromptForm
      :is-open="isFormOpen"
      :editing-id="editingId"
      :item="currentItem"
      @close="() => { isFormOpen = false; editingId = null; }"
      @save="handleSave"
    />

    <PromptDetail
      :is-open="isDetailOpen"
      :item="currentDetailItem"
      @close="() => { isDetailOpen = false; detailId = null; }"
      @copy="handleCopy"
      @edit="openEditForm"
      @delete="deletePrompt"
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
  margin-bottom: 4px;
}

.tag.type-tag {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #4b5563;
  margin-right: 4px;
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
