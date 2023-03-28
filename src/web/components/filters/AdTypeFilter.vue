<template>
  <div class="item-form">
    <span class="title-label">{{ $t('adType.label') }}</span>
    <ul>
      <li>
        <RadioField
            :label="$t('adType.all')"
            :value="AdType.All"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            :label="$t('adType.private')"
            :value="AdType.Private"
            :modelValue="modelValue"
            @change="newValue => $emit('update:modelValue', newValue)"
        />
      </li>
      <li>
        <RadioField
            :label="$t('adType.agency')"
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
