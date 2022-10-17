<template>
  <div class="item-form">
    <span class="title-label">Tipo de alquiler</span>
    <ul>
      <li>
        <RadioField
            label="Indiferente"
            :value="RentalPeriod.All"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            label="Temporada"
            :value="RentalPeriod.ShortTerm"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            label="Larga estancia"
            :value="RentalPeriod.LongTerm"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import RadioField from '../fields/RadioField.vue';
import { RentalPeriod } from '@/web/listing/Listing';

type Props = {
  modelValue: string,
};

type Emits = {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>();
defineEmits<Emits>();
</script>