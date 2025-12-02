<script setup lang="ts">
// KPI state
const totalRevenue = ref(0);
const totalCOGS = ref(0);
const totalProfit = ref(0);
const totalUnitsSold = ref(0);
const totalStockValue = ref(0);

// Chart state
const profitByProduct = ref([]);
const dailySales = ref([]);

// Loading
const loading = ref(true);

// ----------------------------
// FETCH KPI SUMMARY
// ----------------------------
const loadKPIs = async () => {
  loading.value = true;

  // 1) Fetch all client invoice_items
  const { data: items } = await supabase()
    .from('invoice_items')
    .select(
      `
        product_id,
        quantity,
        line_total,
        discount,
        invoices!inner ( invoice_source, created_at )
      `
    )
    .eq('invoices.invoice_source', 'client');

  if (!items) return;

  // Total Revenue
  totalRevenue.value = items.reduce(
    (sum, row) => sum + Number(row.line_total || 0) - Number(row.discount || 0),
    0
  );

  // Total Units Sold
  totalUnitsSold.value = items.reduce(
    (sum, row) => sum + Number(row.quantity || 0),
    0
  );

  // Profit per product (for graph)
  const productProfitMap = new Map();

  // Compute FIFO COGS + PROFIT for each product
  const productIds = [...new Set(items.map(x => x.product_id))];

  let cogs = 0;
  let profit = 0;

  for (const pid of productIds) {
    const { data: c } = await supabase().rpc('fifo_cogs', { product: pid });
    const { data: p } = await supabase().rpc('fifo_profit', { product: pid });

    profit += Number(p || 0);
    cogs += Number(c || 0);

    productProfitMap.set(pid, Number(p || 0));
  }

  totalCOGS.value = cogs;
  totalProfit.value = profit;

  profitByProduct.value = Array.from(productProfitMap.entries()).map(
    ([pid, p]) => ({
      product: pid,
      profit: p,
    })
  );

  loading.value = false;
};

// ----------------------------
// DAILY SALES FOR CHART
// ----------------------------
const loadDailySales = async () => {
  const { data } = await supabase()
    .from('invoice_items')
    .select(
      `
      line_total,
      invoices!inner ( created_at, invoice_source )
    `
    )
    .eq('invoices.invoice_source', 'client');

  if (!data) return;

  const dayMap: Record<string, number> = {};

  data.forEach(item => {
    const day = item.invoices.created_at.split('T')[0];
    dayMap[day] = (dayMap[day] || 0) + Number(item.line_total || 0);
  });

  dailySales.value = Object.keys(dayMap).map(day => ({
    day,
    revenue: dayMap[day],
  }));
};

// ----------------------------
// LOAD ALL
// ----------------------------
onMounted(async () => {
  await loadKPIs();
  await loadDailySales();
});
</script>

<template>
  <Container class="flex flex-col gap-6">
    <!-- KPI CARDS -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <DashboardCard title="Total Revenue" :value="totalRevenue" color="blue" />
      <DashboardCard title="Total COGS" :value="totalCOGS" color="red" />
      <DashboardCard title="Total Profit" :value="totalProfit" color="green" />
      <DashboardCard title="Units Sold" :value="totalUnitsSold" color="gray" />
    </div>

    <!-- CHART ROW -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DashboardBarChart
        :revenue="totalRevenue"
        :cogs="totalCOGS"
        :profit="totalProfit"
      />

      <DashboardLineChart :items="dailySales" />
    </div>

    <!-- PROFIT BY PRODUCT -->
    <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">Profit by Product</h2>
      <DashboardProfitByProduct :items="profitByProduct" />
    </div>
  </Container>
</template>
