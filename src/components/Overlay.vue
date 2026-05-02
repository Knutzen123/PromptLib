<script setup lang="ts">
interface Props {
  isOpen: boolean;
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
  <div v-if="isOpen" class="overlay" @click="handleClose"></div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 300;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s;
}

.overlay.open {
  opacity: 1;
  visibility: visible;
}

[data-theme='dark'] .overlay {
  background: rgba(0, 0, 0, 0.7);
}
</style>
