<script setup lang="ts">
// import { Chart } from "primevue/chart";

const { items } = defineProps<{
  items: any;
}>();

const data = computed(() => ({
  labels: items.map(x => x.product),
  datasets: [
    {
      label: 'Profit',
      backgroundColor: '#22c55e',
      data: items.map(x => x.profit),
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="h-80">
    <Chart type="bar" :data="data" :options="options" />
  </div>
</template>
