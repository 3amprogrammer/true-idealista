<template>
  <label class="input-checkbox">
    <input
        type="checkbox"
        :value="value"
        :checked="checked"
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
  checked: boolean
};

type Emits = {
  (e: 'change', value: string): void
}

defineProps<Props>();
defineEmits<Emits>();
</script>