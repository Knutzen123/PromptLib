<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PromptItem } from '../types';
import Sidebar from './Sidebar.vue';
import Tag from './Tag.vue';

interface Props {
  isOpen: boolean;
  editingId: string | null;
  item: PromptItem | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [data: { title: string; description: string; text: string; tags: string[] }];
}>();

const title = ref('');
const description = ref('');
const text = ref('');
const formTags = ref<string[]>([]);
const tagInput = ref('');
const isDirty = ref(false);

// Reset form when opening
watch(
  () => props.isOpen,
  (open) => {
    if (open && props.item) {
      title.value = props.item.title;
      description.value = props.item.description;
      text.value = props.item.text;
      formTags.value = [...props.item.tags];
    } else if (open) {
      title.value = '';
      description.value = '';
      text.value = '';
      formTags.value = [];
    }
    isDirty.value = false;
  }
);

const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase();
  if (tag && !formTags.value.includes(tag) && formTags.value.length < 10) {
    formTags.value.push(tag);
    tagInput.value = '';
    isDirty.value = true;
  }
};

const removeTag = (index: number) => {
  formTags.value.splice(index, 1);
  isDirty.value = true;
};

const handleTagKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addTag();
  } else if (event.key === 'Backspace' && !tagInput.value && formTags.value.length > 0) {
    removeTag(formTags.value.length - 1);
  }
};

const handleInputChange = () => {
  isDirty.value = true;
};

const handleSave = () => {
  if (!title.value.trim()) {
    alert('Bitte Titel eingeben.');
    return;
  }
  if (!text.value.trim()) {
    alert('Bitte Inhalt eingeben.');
    return;
  }
  emit('save', {
    title: title.value.trim(),
    description: description.value.trim(),
    text: text.value.trim(),
    tags: [...formTags.value]
  });
};

const handleClose = () => {
  if (isDirty.value) {
    if (confirm('Ungespeicherte Änderungen — verwerfen?')) {
      emit('close');
    }
  } else {
    emit('close');
  }
};

const charCount = computed(() => text.value.length);
</script>

<template>
  <Sidebar
    :is-open="isOpen"
    :title="editingId ? 'Eintrag bearbeiten' : 'Neuer Eintrag'"
    @close="handleClose"
  >
    <template #body>
      <div class="form-group">
        <label class="form-label" for="input-title">
          Titel <span class="req">*</span>
        </label>
        <input
          type="text"
          id="input-title"
          v-model="title"
          class="form-input"
          placeholder="Kurzer, treffender Name"
          maxlength="200"
          autocomplete="off"
          @input="handleInputChange"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="input-desc">Kurzbeschreibung</label>
        <textarea
          id="input-desc"
          v-model="description"
          class="form-textarea-sm"
          placeholder="Optional: Worum geht es?"
          maxlength="300"
          @input="handleInputChange"
        ></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="input-text">
          Inhalt <span class="req">*</span>
        </label>
        <textarea
          id="input-text"
          v-model="text"
          class="form-textarea"
          placeholder="System-Prompt / Instructions…"
          maxlength="5000"
          @input="handleInputChange"
        ></textarea>
        <div class="char-count">
          {{ charCount }} / 5000 Zeichen
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Tags</label>
        <div class="tag-input-wrap">
          <Tag
            v-for="(tag, index) in formTags"
            :key="tag"
            :name="tag"
          >
            <template #default>
              <span
                class="tag-remove"
                @click="removeTag(index)"
              >×</span>
            </template>
          </Tag>
          <input
            type="text"
            v-model="tagInput"
            class="tag-input-field"
            placeholder="Tag eingeben…"
            autocomplete="off"
            @keydown="handleTagKeydown"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <button class="btn btn-primary" @click="handleSave">Speichern</button>
      <button class="btn btn-secondary" @click="handleClose">Abbrechen</button>
      <span class="shortcut-hint" style="margin-left: auto">⌘↵</span>
    </template>
  </Sidebar>
</template>

<style scoped>
.form-group {
  margin-bottom: var(--spacing-2);
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.form-label .req {
  color: var(--color-destructive);
}

.form-input,
.form-textarea,
.form-textarea-sm {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
  background: var(--color-surface);
  transition: border-color 0.15s, background-color 0.25s ease;
  color: var(--color-text-primary);
}

.form-textarea-sm {
  resize: vertical;
  min-height: 60px;
}

.form-textarea {
  resize: vertical;
  min-height: 180px;
  line-height: 1.6;
}

.form-input:focus,
.form-textarea:focus,
.form-textarea-sm:focus {
  border-color: var(--color-interactive);
  outline: none;
}

.char-count {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 4px;
  text-align: right;
}

.tag-input-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  min-height: 42px;
  cursor: text;
  background: var(--color-surface);
  transition: border-color 0.15s, background-color 0.25s ease;
}

.tag-input-wrap:focus-within {
  border-color: var(--color-interactive);
}

.tag-input-field {
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  flex: 1;
  min-width: 80px;
  background: transparent;
  color: var(--color-text-primary);
}

.tag-input-field::placeholder {
  color: var(--color-text-muted);
}

.tag {
  position: relative;
}

.tag-remove {
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  opacity: 0.6;
  margin-left: 4px;
}

.tag-remove:hover {
  opacity: 1;
  color: var(--color-destructive);
}
</style>
