<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  tags: string[];
  activeFilter: string;
  itemCounts: {
    popular: number;
    all: number;
    agent: number;
    prompt: number;
    byTag: Record<string, number>;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  filterChange: [tag: string];
}>();

const handleFilterClick = (tag: string) => {
  emit('filterChange', tag);
};

const showAgentFilter = computed(() => props.itemCounts.agent > 0);
const showPromptFilter = computed(() => props.itemCounts.prompt > 0);
</script>

<template>
  <div class="filter-tags">
    <button
      class="filter-tag"
      :class="{ active: activeFilter === 'popular' }"
      data-tag="popular"
      @click="handleFilterClick('popular')"
    >
      Beliebt ({{ itemCounts.popular }})
    </button>
    <button
      class="filter-tag"
      :class="{ active: activeFilter === 'all' }"
      data-tag="all"
      @click="handleFilterClick('all')"
    >
      Alle
    </button>
    <button
      v-if="showAgentFilter"
      class="filter-tag"
      :class="{ active: activeFilter === 'agent' }"
      data-tag="agent"
      @click="handleFilterClick('agent')"
    >
      Agent ({{ itemCounts.agent }})
    </button>
    <button
      v-if="showPromptFilter"
      class="filter-tag"
      :class="{ active: activeFilter === 'prompt' }"
      data-tag="prompt"
      @click="handleFilterClick('prompt')"
    >
      Prompt ({{ itemCounts.prompt }})
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      class="filter-tag"
      :class="{ active: activeFilter === tag }"
      :data-tag="tag"
      @click="handleFilterClick(tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>

<style scoped>
.filter-tags {
  display: flex;
  gap: var(--spacing-1);
  flex-wrap: wrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--tag-font-size, 12px);
  font-weight: var(--tag-font-weight, 500);
  line-height: var(--tag-line-height, 1.5);
  padding: var(--tag-padding, 3px 10px);
  border-radius: var(--tag-radius, 4px);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text-muted);
  transition: all 0.15s;
  cursor: pointer;
  white-space: nowrap;
}

.filter-tag:hover {
  background: var(--color-border);
  color: var(--color-text-primary);
}

.filter-tag.active {
  background: var(--color-interactive);
  border-color: var(--color-interactive);
  color: var(--color-bg);
}

.filter-tag.active:hover {
  opacity: 0.9;
}
</style>
