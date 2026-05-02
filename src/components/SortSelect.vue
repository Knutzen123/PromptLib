<script setup lang="ts">
import type { SortOption } from '../types';

interface Props {
  sortBy: SortOption;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  sortChange: [option: SortOption];
}>();

const handleSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('sortChange', target.value as SortOption);
};
</script>

<template>
  <div class="filter-sort">
    <select
      :value="sortBy"
      @change="handleSortChange"
    >
      <option value="newest">Zuletzt erstellt</option>
      <option value="oldest">Älteste zuerst</option>
      <option value="alpha">A → Z</option>
      <option value="alpha-desc">Z → A</option>
      <option value="popular">Am beliebtesten</option>
    </select>
  </div>
</template>

<style scoped>
.filter-sort {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.filter-sort select {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 4px 8px;
  font-family: inherit;
  font-size: 13px;
  background: var(--color-surface);
  cursor: pointer;
  color: var(--color-text-primary);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
</style>
