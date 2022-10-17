<template>
  <div class="tag-container">
    <ul class="tags">
      <li class="tag" v-for="tag in modelValue">
        <span>{{ tag }}</span>
        <button
            class="close"
            @click="removeTag(tag)"
        >
          &#10005;
        </button>
      </li>
    </ul>
    <input type="text" :placeholder="placeholder" v-model="phrase" @keydown.enter="addTag($event.target.value)">
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Props = {
  modelValue: string[],
  placeholder: string
};

type Emits = {
  (e: 'change', value: string[]): void
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const phrase = ref('');

const removeTag = (removedTag: string) => {
  const newTags = props.modelValue.filter(tag => tag !== removedTag);

  emit('change', newTags);
};

const addTag = (newTag: string) => {
  const tag = newTag.trim();

  if (!tag || props.modelValue.includes(tag)) {
    phrase.value = '';

    return;
  }

  const newTags = [...props.modelValue, newTag.trim()];

  emit('change', newTags);

  phrase.value = '';
};
</script>

<style scoped>
.close {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  background: transparent;
  outline: none;
  border: none;
  padding-top: 0.25rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tags:not(:empty) {
  margin-top: 0.75rem;
}

.tag {
  background: #145BC7;
  color: #FFFFFF;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
}

.tag-container {
  background: #FFFFFF;
  min-height: 2.625rem;
  border: 0.0625rem solid #A3A3A0;
  width: 100%;
  max-width: 21.875rem;
  padding: 0 0.75rem;
}

.tag-container:hover {
  border-color: #B62682;
}

.tag-container:focus-within {
  border: 0.0625rem solid #B1D004;
  box-shadow: 0 0 0.25rem 0 #b1d004;
  outline: none;
}

input {
  width: 100%;
  height: 2.625rem;
  border: none;
  padding: 0;
}

input:focus {
  border: none;
  box-shadow: none;
}
</style>