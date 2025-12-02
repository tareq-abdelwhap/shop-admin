<script setup lang="ts">
// import { Chart } from "primevue/chart";

const { revenue, cogs, profit } = defineProps<{
  revenue: number;
  cogs: number;
  profit: number;
}>();

const data = {
  labels: ['Revenue', 'COGS', 'Profit'],
  datasets: [
    {
      label: 'USD',
      backgroundColor: ['#3b82f6', '#ef4444', '#22c55e'],
      data: [revenue, cogs, profit],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow h-80">
    <h2 class="text-lg font-semibold mb-2">Revenue vs COGS vs Profit</h2>
    <Chart type="bar" :data="data" :options="options" class="h-full" />
  </div>
</template>
