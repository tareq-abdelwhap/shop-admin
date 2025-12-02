<script setup lang="ts">
const dashboardStore = useDashboardStore();
const { dashboard } = storeToRefs(dashboardStore);
dashboardStore.getMetrics();

// const {
//   total_revenue,
//   total_cogs,
//   total_profit,
//   total_units_sold,
//   daily_sales,
//   profit_by_product,
// } = toRefs(dashboard.value.data);

const overview = computed(() => ({
  labels: ['Overview'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: '#3b82f6',
      data: [dashboard.value.data?.total_revenue || 0],
    },
    {
      label: 'COGS',
      backgroundColor: '#ef4444',
      data: [dashboard.value.data?.total_cogs || 0],
    },
    {
      label: 'Profit',
      backgroundColor: '#22c55e',
      data: [dashboard.value.data?.total_profit || 0],
    },
  ],
}));

const dailySales = computed(() => ({
  labels: dashboard.value.data?.daily_sales?.map(i => i.day),
  datasets: [
    {
      label: 'Revenue',
      borderColor: '#3b82f6',
      data: dashboard.value.data?.daily_sales?.map(i => i.revenue),
      fill: false,
    },
    {
      label: 'COGS',
      borderColor: '#ef4444',
      data: dashboard.value.data?.daily_sales?.map(i => i.cogs),
      fill: false,
    },
    {
      label: 'Profit',
      borderColor: '#22c55e',
      data: dashboard.value.data?.daily_sales?.map(i => i.profit),
      fill: false,
    },
  ],
}));

const profitByProduct = computed(() => ({
  labels: dashboard.value.data?.profit_by_product?.map(i => i.product_name),
  datasets: [
    {
      label: 'Profit',
      backgroundColor: '#22c55e',
      data: dashboard.value.data?.profit_by_product?.map(i => i.profit),
    },
  ],
}));
</script>

<template>
  <Container class="flex flex-col gap-6">
    <!-- Loading -->
    <div v-if="dashboard.loading" class="text-center py-10 text-gray-500">
      Loading Dashboard...
    </div>

    <template v-else>
      <!-- KPIs -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Revenue"
          :value="dashboard.data.total_revenue"
          color="blue"
        />
        <DashboardCard
          title="COGS"
          :value="dashboard.data.total_cogs"
          color="red"
        />
        <DashboardCard
          title="Profit"
          :value="dashboard.data.total_profit"
          color="green"
        />
        <DashboardCard
          title="Units Sold"
          :value="dashboard.data.total_units_sold"
          color="purple"
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
        <DashboardProfitByProduct :items="dashboard.data.profit_by_product" />
      </Panel>
    </template>
  </Container>
</template>

<style scoped></style>
