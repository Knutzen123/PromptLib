<script setup lang="ts">
import type { PromptItem } from '../types';

interface Props {
  item: PromptItem;
  isSelected: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [id: string];
  detail: [id: string];
  edit: [id: string];
  copy: [id: string];
  export: [id: string];
  contextMenu: [id: string, event: MouseEvent];
}>();

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const handleCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    emit('select', props.item.id);
  } else {
    emit('select', props.item.id);
  }
};

const getTypeLabel = (type: string): string => {
  return type === 'agent' ? 'Agent' : 'Prompt';
};
</script>

<template>
  <article
    class="card"
    :class="{ selected: isSelected }"
    :data-id="item.id"
    tabindex="0"
  >
    <div class="card-header">
      <input
        type="checkbox"
        class="card-checkbox"
        :data-id="item.id"
        :checked="isSelected"
        :aria-label="`${item.title} auswählen`"
        tabindex="0"
        @change="handleCheckboxChange"
      />
      <div style="flex: 1; min-width: 0">
        <div class="card-tags" style="margin-bottom: var(--spacing-1)">
          <span class="tag type-tag">{{ getTypeLabel(item.type) }}</span>
          <Tag
            v-for="tag in item.tags"
            :key="tag"
            :name="tag"
          />
        </div>
        <h3 class="card-title">{{ item.title }}</h3>
        <p v-if="item.description" class="card-desc">{{ item.description }}</p>
        <div class="card-meta">
          <span
            v-if="item.copyCount > 0"
            class="copy-count"
            :title="`${item.copyCount}x kopiert`"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {{ item.copyCount }}×
          </span>
          <span>Erstellt: {{ formatDate(item.createdAt) }}</span>
        </div>
      </div>
    </div>
    <hr class="card-divider" />
    <div class="card-actions">
      <button
        class="btn btn-ghost btn-sm"
        data-action="detail"
        @click="emit('detail', item.id)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        Detail
      </button>
      <button
        class="btn btn-ghost btn-sm"
        data-action="edit"
        @click="emit('edit', item.id)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Bearbeiten
      </button>
      <button
        class="btn btn-ghost btn-sm"
        data-action="copy"
        @click="emit('copy', item.id)"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Copy
      </button>
      <button
        class="btn btn-ghost btn-sm"
        data-action="export"
        @click="emit('export', item.id)"
      >
        <svg
          width="14"
          height="14"
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
        Export
      </button>
      <button
        class="btn btn-ghost btn-sm"
        data-action="context"
        @click="emit('contextMenu', item.id, $event)"
      >
        ⋯
      </button>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--card-padding);
  transition: border-color 0.15s, box-shadow 0.15s, background-color 0.25s ease;
  position: relative;
  box-shadow: var(--shadow-card);
}

.card:hover {
  border-color: var(--color-text-muted);
}

.card.selected {
  border-color: var(--color-interactive);
  box-shadow: 0 0 0 2px var(--color-interactive);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-1);
}

.card-checkbox {
  margin-top: 2px;
  accent-color: var(--color-interactive);
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.card:hover .card-checkbox,
.card.selected .card-checkbox {
  opacity: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: var(--spacing-1);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-1);
}

.copy-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: var(--color-popular-bg);
  border: 1px solid var(--color-popular-border);
  border-radius: 4px;
  color: var(--color-popular);
  font-weight: 600;
  font-size: 11px;
}

.copy-count svg {
  width: 12px;
  height: 12px;
}

.card-divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-1) 0;
  transition: border-color 0.25s ease;
}

.card-actions {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.card-actions .btn-ghost {
  padding: 4px 6px;
  border-radius: 4px;
}
</style>
