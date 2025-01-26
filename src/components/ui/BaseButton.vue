<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-blue-600 hover:bg-blue-700 text-white': variant === 'primary',
      'bg-gray-200 hover:bg-gray-300 text-gray-800': variant === 'secondary'
    }"
  >
    <slot></slot>
  </button>
</template>