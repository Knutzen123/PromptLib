<script setup lang="ts">
interface Props {
  isDark: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  toggle: [];
}>();

const toggleTheme = () => {
  emit('toggle');
};
</script>

<template>
  <button
    class="theme-toggle"
    :data-theme="isDark ? 'dark' : 'light'"
    @click="toggleTheme"
    :aria-label="isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'"
    :title="isDark ? 'Light Mode (T)' : 'Dark Mode (T)'"
  >
    <!-- Sun Icon -->
    <svg
      class="sun"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
    <!-- Moon Icon -->
    <svg
      class="moon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.2s ease;
  padding: 0;
}

.theme-toggle:hover {
  background: var(--color-bg);
  color: var(--color-text-primary);
  border-color: var(--color-text-muted);
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.theme-toggle[data-theme="dark"] svg.sun {
  display: none;
}

.theme-toggle:not([data-theme="dark"]) svg.moon {
  display: none;
}
</style>
