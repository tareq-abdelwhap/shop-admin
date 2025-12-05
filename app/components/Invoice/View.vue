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

  <div
    id="printer"
    class="flex flex-col gap-6 p-1"
    :dir="$i18n.localeProperties.value.dir"
  >
    <Card class="w-fit">
      <template #content>
        <table>
          <tr>
            <td class="w-40">
              <span class="font-semibold" v-text="`${$t('customerName')}:`" />
            </td>
            <td>
              <span class="" v-text="invoice?.customer_name" />
            </td>
          </tr>
          <tr>
            <td>
              <span class="font-semibold" v-text="`${$t('date')}:`" />
            </td>
            <td>
              <span
                class=""
                v-text="new Date(invoice?.created_at).toLocaleString()"
              />
            </td>
          </tr>

          <tr>
            <td>
              <span class="font-semibold" v-text="`${$t('agentName')}:`" />
            </td>
            <td>
              <span class="" v-text="invoice?.shop_members?.full_name" />
            </td>
          </tr>

          <tr>
            <td>
              <span class="font-semibold" v-text="`${$t('shop')}:`" />
            </td>
            <td>
              <span class="" v-text="authUser?.shopName" />
            </td>
          </tr>
        </table>
      </template>
    </Card>

    <table class="w-full border rounded-lg overflow-hidden">
      <tr>
        <th class="w-[4%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('id')" />
        </th>
        <th class="border text-start p-1.5">
          <span class="font-semibold" v-text="$t('description')" />
        </th>
        <th class="w-[15%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('price')" />
        </th>
        <th class="w-[15%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('discount')" />
        </th>
        <th class="w-[6%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('quantity')" />
        </th>
        <th class="w-[15%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('total')" />
        </th>
        <th class="w-[15%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('totalAfterDiscount')" />
        </th>
      </tr>

      <tr v-for="(item, idx) in items" :key="item.id">
        <td class="border p-1.5">
          <span class="font-semibold" v-text="`${idx + 1}`" />
        </td>
        <td class="border p-1.5">
          <span class="" v-text="item.description" />
        </td>
        <td class="border p-1.5">
          <span class="" v-text="useFormatPrice(item.unit_price)" />
        </td>
        <td class="border p-1.5">
          <span class="" v-text="useFormatPrice(item.discount)" />
        </td>
        <td class="border p-1.5">
          <span class="" v-text="item.quantity" />
        </td>
        <td class="border p-1.5">
          <span class="" v-text="useFormatPrice(item.line_total)" />
        </td>
        <td class="border p-1.5">
          <span
            class=""
            v-text="useFormatPrice(item.line_total - item.discount)"
          />
        </td>
      </tr>
    </table>

    <table class="w-full">
      <tr>
        <td />
        <td class="w-[21%] border text-start p-1.5">
          <span class="font-semibold" v-text="$t('total')" />
        </td>
        <td class="w-[15%] border text-start p-1.5">
          {{
            useFormatPrice(
              invoice?.total - items.reduce((sum, r) => sum + r.discount, 0)
            )
          }}
        </td>
      </tr>

      <tr>
        <td />
        <td class="border text-start p-1.5">
          <span class="font-semibold" v-text="$t('extraDiscount')" />
        </td>
        <td class="border text-start p-1.5">
          {{ useFormatPrice(invoice?.extra_discount || 0) }}
        </td>
      </tr>

      <tr>
        <td />
        <td class="border text-start p-1.5">
          <span class="font-semibold" v-text="$t('totalAfterDiscount')" />
        </td>
        <td class="border text-start p-1.5">
          {{
            useFormatPrice(
              invoice?.total - (invoice?.discount + invoice?.extra_discount)
            )
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
@media print {
  #printer {
    font-size: 10px;
  }
  .border {
    border: 1px solid #00000050 !important;
  }
}
</style>
