<template>
  <div class="item-form">
    <span class="title-label">Descripción</span>
    <TagField
        placeholder="Buscar en la descripción"
        :modelValue="phrases"
        @change="newPhrases => $emit('update:phrases', newPhrases)"
    />

    <ul class="search-type">
      <li>
        <RadioField
            label="Destacar resultados"
            :value="SearchType.Highlight"
            :modelValue="type"
            @change="newValue => $emit('update:type', newValue)"
        />
      </li>

      <li>
        <RadioField
            label="Mostrar sólo coincidentes"
            :value="SearchType.Strict"
            :modelValue="type"
            @change="newValue => $emit('update:type', newValue)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import RadioField from '../fields/RadioField.vue';
import TagField from '../fields/TagField.vue';
import { ref } from 'vue';
import { SearchType } from '@/web/listing/Listing';

type Props = {
  phrases: string[],
  type: string,
};

type Emits = {
  (e: 'update:phrases', phrases: string[]): void
  (e: 'update:type', type: string): void
}

defineProps<Props>();
defineEmits<Emits>();

const tag = ref('');

</script>

<style scoped>
.search-type {
  margin-top: 0.4375rem;
}
</style>