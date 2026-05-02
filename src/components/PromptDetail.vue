<script setup lang="ts">
import { computed } from 'vue';
import type { PromptItem } from '../types';

interface Props {
  isOpen: boolean;
  item: PromptItem | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  copy: [id: string];
  edit: [id: string];
  delete: [id: string];
}>();

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getTypeLabel = (type: string): string => {
  return type === 'agent' ? 'Agent' : 'Prompt';
};

const handleClose = () => {
  emit('close');
};

const handleCopy = () => {
  if (props.item) {
    emit('copy', props.item.id);
  }
};

const handleEdit = () => {
  if (props.item) {
    emit('edit', props.item.id);
  }
};

const handleDelete = () => {
  if (props.item) {
    emit('delete', props.item.id);
  }
};
</script>

<template>
  <Sidebar
    :is-open="isOpen"
    title="Details"
    @close="handleClose"
  >
    <template #body v-if="item">
      <div class="detail-tags">
        <span class="tag type-tag">{{ getTypeLabel(item.type) }}</span>
        <Tag
          v-for="tag in item.tags"
          :key="tag"
          :name="tag"
        />
      </div>

      <div
        v-if="item.description"
        class="detail-desc-wrap"
        style="margin-bottom: var(--spacing-2)"
      >
        <div class="label-meta" style="margin-bottom: 4px">Beschreibung</div>
        <div
          id="detail-desc"
          style="font-size: 14px; color: var(--color-text-muted); line-height: 1.5"
        >
          {{ item.description }}
        </div>
        <hr
          style="border: none; border-top: 1px solid var(--color-border); margin: var(--spacing-1) 0"
        />
      </div>

      <div class="label-meta" style="margin-bottom: 6px">Inhalt</div>
      <div class="detail-text">{{ item.text }}</div>

      <div class="detail-meta">
        Erstellt: {{ formatDate(item.createdAt) }}
        <span v-if="item.copyCount > 0">
          · {{ item.copyCount }}× kopiert
        </span>
      </div>
    </template>

    <template #footer v-if="item">
      <button class="btn btn-secondary" @click="handleCopy">
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
        Kopieren
      </button>
      <button class="btn btn-secondary" @click="handleEdit">
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
      <button class="btn btn-destructive" @click="handleDelete">
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
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Löschen
      </button>
    </template>
  </Sidebar>
</template>

<style scoped>
.detail-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-2);
}

.detail-text {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--spacing-2);
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: var(--spacing-2);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.detail-text::-webkit-scrollbar {
  width: 6px;
}

.detail-text::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.detail-text::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 3px;
}

.detail-meta {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-2);
}
</style>
