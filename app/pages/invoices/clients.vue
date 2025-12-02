<script setup lang="ts">
const select = '*, shop_members(full_name), invoice_items(sum:quantity)';
const count = { count: 'exact' };

const invoice_source = 'client';
const where = { invoice_source };

const invoiceStore = useStore('invoice', { select, where });

const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'id', header: t('id'), class: 'w-24' },
  { field: 'created_at', header: t('date'), type: 'date' },
  { field: 'customer_name', header: t('customerName') },
  { field: 'invoice_items.0.sum', header: t('quantity') },
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
    :count
    :where
    :columns
    :fields
    with-view-button
    with-delete-button
    @add="() => (createVisible = true)"
    @view="record => [(invoiceId = record.id), (viewVisible = true)]"
  >
    <!-- <template #table>
      <Column field="total_after_discount" :header="$t('totalAfterDiscount')">
        <template #body="{ data }">
          {{ formatPrice(data.total - (data.discount + data.extra_discount)) }}
        </template>
      </Column>
    </template> -->
  </Page>

  <Drawer
    v-model:visible="createVisible"
    :header="$t('createInvoice')"
    :position="$i18n.localeProperties.value.dir === 'rtl' ? 'left' : 'right'"
    class="!w-full lg:!w-2/3"
  >
    <InvoiceCreate
      key="client"
      :invoice-source="invoice_source"
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
