<template>
  <div class="item-form">
    <span class="title-label">Tipo de anuncio</span>
    <ul>
      <li>
        <RadioField
            label="Indiferente"
            :value="AdType.All"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            label="Con propietario"
            :value="AdType.Private"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            label="Con agencia"
            :value="AdType.Agency"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import RadioField from '../fields/RadioField.vue';
import { AdType } from '@/web/listing/Listing';

type Props = {
  modelValue: string,
};

type Emits = {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>();
defineEmits<Emits>();
</script>