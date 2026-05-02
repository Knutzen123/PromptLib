<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
}

const props = defineProps<Props>();

// Tag-Farben für Light Mode
const TAG_COLORS = [
  { bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF' },
  { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' },
  { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E' },
  { bg: '#FCE7F3', border: '#F9A8D4', text: '#9D174D' },
  { bg: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6' },
  { bg: '#FFEDD5', border: '#FDBA74', text: '#9A3412' },
  { bg: '#E0F2FE', border: '#7DD3FC', text: '#075985' },
  { bg: '#FDF2F8', border: '#F9A8D4', text: '#BE185D' },
  { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
  { bg: '#FEF9C3', border: '#FDE047', text: '#854D0E' },
  { bg: '#F1F5F9', border: '#94A3B8', text: '#334155' },
  { bg: '#FFF1F2', border: '#FDA4AF', text: '#9F1239' },
];

// Tag-Farben für Dark Mode
const TAG_COLORS_DARK = [
  { bg: '#1E3A5F', border: '#3B82F6', text: '#93C5FD' },
  { bg: '#164E2E', border: '#22C55E', text: '#86EFAC' },
  { bg: '#5C4414', border: '#F59E0B', text: '#FCD34D' },
  { bg: '#5C1A3D', border: '#EC4899', text: '#F9A8D4' },
  { bg: '#3B2A6B', border: '#8B5CF6', text: '#C4B5FD' },
  { bg: '#5C3B14', border: '#F97316', text: '#FDBA74' },
  { bg: '#0C4A6E', border: '#0EA5E9', text: '#7DD3FC' },
  { bg: '#5C1A4D', border: '#EC4899', text: '#F9A8D4' },
  { bg: '#064E3B', border: '#14B8A6', text: '#6EE7B7' },
  { bg: '#5C4D0C', border: '#EAB308', text: '#FDE047' },
  { bg: '#334155', border: '#64748B', text: '#94A3B8' },
  { bg: '#5C1A2E', border: '#EF4444', text: '#FDA4AF' },
];

// Feste Tag-Farben für häufig verwendete Tags
const FIXED_TAG_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  code: { bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF' },
  ai: { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' },
  writing: { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E' },
  marketing: { bg: '#FCE7F3', border: '#F9A8D4', text: '#9D174D' },
  design: { bg: '#EDE9FE', border: '#C4B5FD', text: '#5B21B6' },
  data: { bg: '#FFEDD5', border: '#FDBA74', text: '#9A3412' },
  social_media: { bg: '#E0F2FE', border: '#7DD3FC', text: '#075985' },
  sales: { bg: '#FDF2F8', border: '#F9A8D4', text: '#BE185D' },
  devops: { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
  education: { bg: '#FEF9C3', border: '#FDE047', text: '#854D0E' },
};

const FIXED_TAG_COLORS_DARK: Record<string, { bg: string; border: string; text: string }> = {
  code: { bg: '#1E3A5F', border: '#3B82F6', text: '#93C5FD' },
  ai: { bg: '#164E2E', border: '#22C55E', text: '#86EFAC' },
  writing: { bg: '#5C4414', border: '#F59E0B', text: '#FCD34D' },
  marketing: { bg: '#5C1A3D', border: '#EC4899', text: '#F9A8D4' },
  design: { bg: '#3B2A6B', border: '#8B5CF6', text: '#C4B5FD' },
  data: { bg: '#5C3B14', border: '#F97316', text: '#FDBA74' },
  social_media: { bg: '#0C4A6E', border: '#0EA5E9', text: '#7DD3FC' },
  sales: { bg: '#5C1A4D', border: '#EC4899', text: '#F9A8D4' },
  devops: { bg: '#064E3B', border: '#14B8A6', text: '#6EE7B7' },
  education: { bg: '#5C4D0C', border: '#EAB308', text: '#FDE047' },
};

const getTagColor = computed(() => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const colors = isDark ? FIXED_TAG_COLORS_DARK : FIXED_TAG_COLORS;
  
  if (colors[props.name]) {
    return colors[props.name];
  }
  
  const colorSet = isDark ? TAG_COLORS_DARK : TAG_COLORS;
  let hash = 0;
  for (let i = 0; i < props.name.length; i++) {
    hash = ((hash << 5) - hash) + props.name.charCodeAt(i);
    hash |= 0;
  }
  return colorSet[Math.abs(hash) % colorSet.length];
});

const style = computed(() => ({
  background: getTagColor.value.bg,
  borderColor: getTagColor.value.border,
  color: getTagColor.value.text
}));
</script>

<template>
  <span class="tag" :style="style">
    {{ name }}
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--tag-font-size, 12px);
  font-weight: var(--tag-font-weight, 500);
  line-height: var(--tag-line-height, 1.5);
  padding: var(--tag-padding, 3px 10px);
  border-radius: var(--tag-radius, 4px);
  border: 1px solid;
  transition: all 0.15s;
  white-space: nowrap;
}
</style>
