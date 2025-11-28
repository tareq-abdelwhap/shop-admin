<script setup lang="ts">
const { authUser } = storeToRefs(useAuthStore());

const invoiceStore = useInvoiceStore();
const { invoices } = storeToRefs(invoiceStore);
invoiceStore.fetchInvoices();

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

const deletingId = ref<number | null>(null);
const removeInvoice = async (invoice: any) => {
  if (!confirm('Delete this Invoice?')) return;
  deletingId.value = invoice.id;
  await invoiceStore.deleteRestoreInvoice('delete', invoice);
  deletingId.value = null;
};

const restoreInvoice = async (invoice: any) => {
  if (!confirm('Restore this Invoice?')) return;
  deletingId.value = invoice.id;
  await invoiceStore.deleteRestoreInvoice('restore', invoice);
  deletingId.value = null;
};

const createVisible = ref(false);
const viewVisible = ref(false);
const invoiceId = ref<number>();

const afterCreate = async (_invoiceId: number) => {
  createVisible.value = false;
  invoiceStore.fetchInvoices();
  invoiceId.value = _invoiceId;
  viewVisible.value = true;
};

const onPagination = (page: { page: number; rows: number }) => {
  invoices.value.pagination.page = page.page;
  invoices.value.pagination.rows = page.rows;
  invoiceStore.fetchInvoices();
};
</script>

<template>
  <Page
    module="invoices"
    select="*, shop_members ( full_name )"
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
    <InvoiceCreate @submitted="invoiceId => afterCreate(invoiceId)" />
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
