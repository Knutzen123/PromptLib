<script setup lang="ts">
interface Props {
  count: number;
}

defineProps<Props>();
const emit = defineEmits<{
  export: [];
  delete: [];
  clear: [];
}>();
</script>

<template>
  <div class="bulk-toolbar" :class="{ visible: count > 0 }">
    <div class="bulk-left">
      <span id="bulk-count">{{ count }} ausgewählt</span>
      <button class="btn btn-secondary btn-sm" @click="emit('export')">
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
        Exportieren
      </button>
      <button class="btn btn-destructive btn-sm" @click="emit('delete')">
        Löschen
      </button>
    </div>
    <button class="btn btn-ghost btn-sm" @click="emit('clear')">
      ✕ Auswahl aufheben
    </button>
  </div>
</template>

<style scoped>
.bulk-toolbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: var(--spacing-2);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.bulk-toolbar.visible {
  display: flex;
}

.bulk-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.bulk-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}
</style>
