<script setup lang="ts">
interface Props {
  count: number;
  totalCount: number;
}

defineProps<Props>();
</script>

<template>
  <span class="filter-count">
    {{ count }} Eintrag{{ count !== 1 ? 'e' : '' }}
  </span>
</template>

<style scoped>
.filter-count {
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>
