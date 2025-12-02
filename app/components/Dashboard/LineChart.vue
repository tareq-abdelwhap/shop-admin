<script setup lang="ts">
// import { Chart } from 'primevue/chart';

const { items } = defineProps<{
  items: any;
}>();

const data = computed(() => ({
  labels: items.map(x => x.day),
  datasets: [
    {
      label: 'Daily Revenue',
      borderColor: '#3b82f6',
      fill: false,
      data: items.map(x => x.revenue),
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow h-80">
    <h2 class="text-lg font-semibold mb-2">Daily Sales</h2>
    <Chart type="line" :data="data" :options="options" class="h-full" />
  </div>
</template>
