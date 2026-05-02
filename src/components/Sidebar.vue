<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title: string;
}

defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <aside
    class="sidebar"
    :class="{ open: isOpen }"
    role="dialog"
  >
    <div class="sidebar-header">
      <h2>{{ title }}</h2>
      <button class="btn btn-ghost btn-sm" @click="handleClose">✕</button>
    </div>
    <div class="sidebar-body">
      <slot name="body"></slot>
    </div>
    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 310;
  width: var(--sidebar-width);
  max-width: 100%;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  transform: translateX(100%);
  transition: transform 0.3s ease, background-color 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar.reference-mode {
  opacity: 0.6;
  pointer-events: none;
  z-index: 309 !important;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  transition: border-color 0.25s ease;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}

.sidebar-body::-webkit-scrollbar {
  width: 8px;
}

.sidebar-body::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.sidebar-body::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

.sidebar-body::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.sidebar-footer {
  padding: var(--spacing-2);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-1);
  flex-shrink: 0;
  transition: border-color 0.25s ease;
}
</style>
