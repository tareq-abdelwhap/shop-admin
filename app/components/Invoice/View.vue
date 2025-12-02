<script lang="ts" setup>
const { invoiceSource, invoiceId } = defineProps<{
  invoiceSource?: 'client' | 'vendor';
  invoiceId: number | undefined;
}>();

const { authUser } = storeToRefs(useAuthStore());

const loading = ref(false);
const invoice = ref<any | null>(null);
const items = ref<any[]>([]);

const fetchInvoice = async () => {
  loading.value = true;

  const { data, error } = await supabase()
    .from('invoices')
    .select('*, shop_members ( full_name )')
    .eq('id', invoiceId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  invoice.value = data;

  const { data: invoiceItems, error: itemsError } = await supabase()
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId);

  if (itemsError) {
    console.error(itemsError);
    return;
  }

  items.value = invoiceItems || [];

  loading.value = false;
};

fetchInvoice();
</script>

<template>
  <div class="flex justify-between mb-4">
    <Button
      v-print="'#printer'"
      class="ms-auto font-semibold"
      size="small"
      v-text="$t('print')"
    />
  </div>

  <div id="printer" :dir="$i18n.localeProperties.value.dir">
    <div class="print-header grid grid-cols-2 gap-8 mb-10">
      <div class="grid grid-cols-2 gap-2">
        <span class="font-semibold" v-text="`${$t('customerName')}:`" />
        <span class="" v-text="invoice?.customer_name" />

        <span class="font-semibold" v-text="`${$t('date')}:`" />
        <span
          class=""
          v-text="new Date(invoice?.created_at).toLocaleString()"
        />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <span class="font-semibold" v-text="`${$t('agentName')}:`" />
        <span class="" v-text="invoice?.shop_members?.full_name" />

        <span class="font-semibold" v-text="`${$t('shop')}:`" />
        <span class="" v-text="authUser?.shopName" />
      </div>
    </div>

    <DataTable :value="items" :loading size="small">
      <Column field="id" :header="$t('id')" class="w-10 text-center">
        <template #body="{ data, index }">
          {{ index + 1 }}
        </template>
      </Column>

      <Column field="description" :header="$t('description')" class="w-1/4" />

      <Column :header="$t('price')">
        <template #body="{ data }">
          {{ useFormatPrice(data.unit_price) }}
        </template>
      </Column>

      <Column v-if="invoiceSource === 'client'" :header="$t('discount')">
        <template #body="{ data }">
          {{ useFormatPrice(data.discount) }}
        </template>
      </Column>

      <Column field="quantity" :header="$t('quantity')" />

      <Column :header="$t('total')">
        <template #body="{ data }">
          {{ useFormatPrice(data.line_total) }}
        </template>
      </Column>

      <Column
        v-if="invoiceSource === 'client'"
        :header="$t('totalAfterDiscount')"
      >
        <template #body="{ data }">
          {{ useFormatPrice(data.discount && data.line_total - data.discount) }}
        </template>
      </Column>

      <ColumnGroup type="footer">
        <Row>
          <Column
            :footer="`${$t('total')}:`"
            :colspan="3"
            footerStyle="text-align:end"
          />
          <Column
            v-if="invoiceSource === 'client'"
            :footer="
              useFormatPrice(items.reduce((sum, r) => sum + r.discount, 0) || 0)
            "
          />
          <Column :footer="items.reduce((sum, r) => sum + r.quantity, 0)" />
          <Column :footer="useFormatPrice(invoice?.total || 0)" />
          <Column
            v-if="invoiceSource === 'client'"
            :footer="
              useFormatPrice(
                (items.reduce((sum, r) => sum + r.discount, 0) &&
                  invoice?.total -
                    items.reduce((sum, r) => sum + r.discount, 0)) ||
                  0
              )
            "
          />
        </Row>
        <Row v-if="invoiceSource === 'client'">
          <Column
            :footer="`${$t('extraDiscount')}:`"
            :colspan="3"
            footerStyle="text-align:end"
          />
          <Column
            :colspan="4"
            :footer="useFormatPrice(invoice?.extra_discount || 0)"
          />
        </Row>
        <Row v-if="invoiceSource === 'client'">
          <Column
            :footer="`${$t('totalAfterDiscount')}:`"
            :colspan="3"
            footerStyle="text-align:end"
          />
          <Column :colspan="3" />
          <Column
            :footer="
              useFormatPrice(
                (invoice?.discount + invoice?.extra_discount &&
                  invoice?.total -
                    (invoice?.discount + invoice?.extra_discount)) ||
                  0
              )
            "
          />
        </Row>
      </ColumnGroup>
    </DataTable>
  </div>
</template>

<style scoped>
@media print {
  #printer {
    font-size: 10px;
  }
}
</style>
