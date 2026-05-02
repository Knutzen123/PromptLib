<script setup lang="ts">
interface Props {
  message: string;
  searchTerm?: string;
}

defineProps<Props>();
const emit = defineEmits<{
  resetFilters: [];
  createNew: [];
}>();
</script>

<template>
  <div class="empty-state">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
    <h3>Deine Bibliothek ist leer.</h3>
    <p>Erstelle deinen ersten Eintrag oder importiere .json / .md / .txt Dateien.</p>
    <button class="btn btn-primary" @click="emit('createNew')">
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
      Ersten Eintrag anlegen
    </button>
  </div>
  <div v-if="searchTerm" class="empty-state hidden">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
    <h3>Keine Einträge gefunden.</h3>
    <p>
      Kein Ergebnis für „<span id="empty-search-term">{{ searchTerm }}</span>"
      gefunden.
    </p>
    <button class="btn btn-secondary" @click="emit('resetFilters')">
      Filter zurücksetzen
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: var(--spacing-6) var(--spacing-3);
  color: var(--color-text-muted);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-2);
  color: var(--color-border);
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
}

.empty-state p {
  margin-bottom: var(--spacing-2);
}
</style>
