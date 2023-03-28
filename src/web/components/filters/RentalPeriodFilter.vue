<template>
  <div class="item-form">
    <span class="title-label">{{ $t('rentalPeriod.label') }}</span>
    <ul>
      <li>
        <RadioField
            :label="$t('rentalPeriod.all')"
            :value="RentalPeriod.All"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            :label="$t('rentalPeriod.shortTerm')"
            :value="RentalPeriod.ShortTerm"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            :label="$t('rentalPeriod.longTerm')"
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
