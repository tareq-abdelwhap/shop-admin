<script setup lang="ts">
const select = '*, shop_members ( full_name )';

const invoice_source = 'vendor';
const where = { invoice_source };

const invoiceStore = useStore('invoice', { select, where });

const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'id', header: t('id'), class: 'w-24' },
  { field: 'created_at', header: t('date'), type: 'date' },
  { field: 'customer_name', header: t('customerName') },
  { field: 'total', header: t('total') },
  { field: 'total_after_discount', header: t('totalAfterDiscount') },
  { field: 'shop_members.full_name', header: t('createdBy') },
];

const fields = ref<Field[]>([
  { key: 'name', label: t('name'), type: 'text', value: null },
  { key: 'price', label: t('price'), type: 'number', value: null },
  { key: 'discount', label: t('discount'), type: 'number', value: null },
]);

const createVisible = ref(false);
const viewVisible = ref(false);
const invoiceId = ref<number>();

const afterCreate = async (_invoiceId: number) => {
  createVisible.value = false;
  invoiceStore.fetchRecords();
  invoiceId.value = _invoiceId;
  viewVisible.value = true;
};
</script>

<template>
  <Page
    module="invoices"
    :select
    :where
    :columns
    :fields
    with-view-button
    with-delete-button
    @add="() => (createVisible = true)"
    @view="record => [(invoiceId = record.id), (viewVisible = true)]"
  />

  <Drawer
    v-model:visible="createVisible"
    :header="$t('createInvoice')"
    :position="$i18n.localeProperties.value.dir === 'rtl' ? 'left' : 'right'"
    class="!w-full lg:!w-2/3"
  >
    <InvoiceCreate
      key="vendor"
      invoice-source="vendor"
      @submitted="invoiceId => afterCreate(invoiceId)"
    />
  </Drawer>

  <Drawer
    v-model:visible="viewVisible"
    :header="$t('invoiceDetails')"
    :position="$i18n.localeProperties.value.dir === 'rtl' ? 'left' : 'right'"
    class="!w-full lg:!w-2/3"
  >
    <InvoiceView :invoice-id />
  </Drawer>
</template>
