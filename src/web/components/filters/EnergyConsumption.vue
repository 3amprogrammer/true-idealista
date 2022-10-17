<template>
  <div class="item-form">
    <span class="title-label">Certificado energético</span>

    <ul class="energy-consumption">
      <li v-for="value in values">
        <CheckboxField
            :label="value"
            :value="value"
            :checked="modelValue.includes(value)"
            @change="handleChange"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import CheckboxField from '@/web/components/fields/CheckboxField.vue';

const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

type Props = {
  modelValue: string[],
};

const props = defineProps<Props>();

type Emits = {
  (e: 'update:modelValue', value: string[]): void
}

const emit = defineEmits<Emits>();

const addValue = (value: string, modelValue: string[]) => {
  const valueIndex = values.indexOf(value);
  const newValues = values.slice(0, valueIndex + 1);

  const newModelValue = new Set([
    ...newValues,
    ...modelValue,
  ]);

  return Array.from(newModelValue);
};

const handleChange = (value: string) => {
  let newValue;
  if (props.modelValue.includes(value)) {
    newValue = props.modelValue.filter(v => v !== value);
  } else {
    newValue = addValue(value, props.modelValue);
  }

  emit('update:modelValue', newValue);
};

</script>

<style scoped>
.energy-consumption {
  display: flex;
  flex-wrap: wrap;
  row-gap: 1rem;
}

.energy-consumption .input-checkbox {
  margin-top: 0 !important;
}
</style>