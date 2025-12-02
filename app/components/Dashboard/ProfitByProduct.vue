<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

defineProps<{
  items: {
    product_id: string;
    product_name: string;
    revenue: number;
    cogs: number;
    profit: number;
  }[];
}>();
</script>

<template>
  <DataTable :value="items" stripedRows responsiveLayout="scroll">
    <Column field="product_name" header="Product" />
    <Column field="revenue" header="Revenue" />
    <Column field="cogs" header="COGS" />
    <Column field="profit" header="Profit" />
  </DataTable>
</template>
