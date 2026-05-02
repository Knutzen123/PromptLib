<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>

<template>
  <nav class="nav" role="navigation">
    <div class="nav-inner">
      <a href="#" class="nav-brand">
        <slot name="brand">PromptLib</slot>
      </a>
      <div class="nav-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  height: var(--nav-height);
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-3);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.25s ease;
}

.nav-brand svg {
  width: 22px;
  height: 22px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}
</style>
