<script setup lang="ts">
defineProps<{
  title: string;
  value: number;
  color: string;
}>();
</script>

<template>
  <div
    class="p-5 rounded-xl shadow bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
  >
    <p class="text-sm opacity-70">{{ title }}</p>
    <p
      :class="[
        'text-3xl font-bold mt-1',
        color === 'blue' && 'text-blue-500',
        color === 'green' && 'text-green-500',
        color === 'red' && 'text-red-500',
      ]"
    >
      {{ value.toLocaleString() }}
    </p>
  </div>
</template>
