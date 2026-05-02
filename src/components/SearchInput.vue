<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  search: [query: string];
}>();

const localValue = ref(props.modelValue);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localValue.value = target.value;
  emit('update:modelValue', localValue.value);
};

const handleSearch = () => {
  emit('search', localValue.value);
};
</script>

<template>
  <div class="search-wrap">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input
      type="text"
      class="search-input"
      :value="modelValue"
      @input="handleInput"
      @keyup.enter="handleSearch"
      placeholder="Suche in Titel, Text & Tags…"
      aria-label="Suchen"
    />
  </div>
</template>

<style scoped>
.search-wrap {
  position: relative;
  max-width: 400px;
  margin-bottom: var(--spacing-3);
}

.search-wrap svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  background: var(--color-surface);
  transition: border-color 0.15s, background-color 0.25s ease;
  color: var(--color-text-primary);
}

.search-input:focus {
  border-color: var(--color-interactive);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}
</style>
