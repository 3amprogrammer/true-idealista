<template>
  <label class="input-radio">
    <input
        type="radio"
        :value="value"
        :checked="modelValue === value"
        @change="$emit('change', $event.target.value)"
    />
    <span>
      <span>
        {{ label }}
      </span>
    </span>
  </label>
</template>

<script setup lang="ts">
type Props = {
  label: String,
  value: String,
  modelValue: String
};

type Emits = {
  (e: 'change', value: string): void
}

defineProps<Props>();
defineEmits<Emits>();
</script>