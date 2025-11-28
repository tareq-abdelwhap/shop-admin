<script setup lang="ts">
const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'name', header: t('name'), sortable: true },
  { field: 'price', header: t('price'), sortable: true, type: 'price' },
  { field: 'discount', header: t('discount'), sortable: true, type: 'date' },
];

// Form validation setup
const fields = ref<Field[]>([
  { key: 'name', label: t('name'), type: 'text', value: null },
  { key: 'price', label: t('price'), type: 'number', value: null },
  { key: 'discount', label: t('discount'), type: 'number', value: null },
]);
</script>

<template>
  <Page
    module="services"
    :columns
    :fields
    :validation-exceptions="['discount']"
    with-edit-button
    with-delete-button
  />
</template>
