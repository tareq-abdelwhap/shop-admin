<script setup lang="ts">
const dashboardStore = useDashboardStore();
const { dashboard } = storeToRefs(dashboardStore);
dashboardStore.getMetrics();

const KPIs = computed(() => [
  {
    title: $t('revenue'),
    value: dashboard.value.data?.total_revenue || 0,
    color: 'blue',
  },
  {
    title: $t('cogs'),
    value: dashboard.value.data?.total_cogs || 0,
    color: 'red',
  },
  {
    title: $t('profit'),
    value: dashboard.value.data?.total_profit || 0,
    color: 'green',
  },
  {
    title: $t('unitsSold'),
    value: dashboard.value.data?.total_units_sold || 0,
    color: 'purple',
  },
  {
    title: $t('expenses'),
    value: dashboard.value.data?.total_expenses || 0,
    color: 'orange',
  },
  {
    title: $t('manualIncome'),
    value: dashboard.value.data?.total_manual_income || 0,
    color: 'yellow',
  },
  {
    title: $t('netProfit'),
    value: dashboard.value.data?.net_profit || 0,
    color: 'indigo',
  },
]);

const overview = computed(() => {
  const d = dashboard.value.data;

  return {
    labels: [
      $t('revenue'),
      $t('cogs'),
      $t('expenses'),
      $t('profit'),
      $t('netProfit'),
    ],
    datasets: [
      {
        label: $t('overview'),
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#f97316',
          '#22c55e',
          '#a855f7',
        ],
        data: [
          d?.total_revenue,
          d?.total_cogs,
          d?.total_expenses,
          d?.total_profit,
          d?.net_profit,
        ],
        barThickness: 36,
        indexAxis: 'x',
      },
    ],
  };
});

const dailySales = computed(() => {
  const d = dashboard.value.data;
  const items = d?.daily_sales || [];

  return {
    labels: items.map(i => i.day),
    datasets: [
      {
        label: 'Revenue',
        borderColor: '#3b82f6',
        data: items.map(i => i.revenue),
        fill: false,
        tension: 0.4,
      },
      {
        label: 'COGS',
        borderColor: '#ef4444',
        data: items.map(i => i.cogs),
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Profit',
        borderColor: '#22c55e',
        data: items.map(i => i.profit),
        fill: false,
        tension: 0.4,
      },
    ],
  };
});

const profitByProduct = computed(() => {
  const d = dashboard.value.data;
  const items = d?.profit_by_product || [];

  return {
    labels: items.map(i => i.product_name),
    datasets: [
      {
        label: 'Profit',
        backgroundColor: '#22c55e',
        data: items.map(i => i.profit),
      },
    ],
  };
});
</script>

<template>
  <Container class="flex flex-col gap-6">
    <!-- Loading -->
    <div v-if="dashboard.loading" class="text-center py-10 text-gray-500">
      Loading Dashboard...
    </div>

    <template v-else>
      <!-- KPIs -->
      <!-- <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> -->
      <!-- flex div with something to config the dashcoard-card to only show 4 at a row -->
      <div class="flex flex-wrap justify-center gap-4">
        <DashboardCard
          v-for="kpi in KPIs"
          :key="kpi.title"
          v-bind="kpi"
          :value="useFormatPrice(kpi.value)"
          class="basis-1/3 md:basis-1/4 lg:basis-1/5 grow"
        />
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel header="Overview" class="rounded-2xl border-none">
          <DashboardChart type="bar" :data="overview" />
        </Panel>

        <Panel header="Daily Sales" class="rounded-2xl border-none">
          <DashboardChart type="line" :data="dailySales" />
        </Panel>
      </div>

      <!-- Profit by Product -->
      <Panel header="Profit by Product" class="rounded-2xl border-none">
        <DashboardProfitByProduct
          :items="dashboard.data?.profit_by_product || []"
        />
      </Panel>
    </template>
  </Container>
</template>

<style scoped></style>
