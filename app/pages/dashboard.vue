<script setup lang="ts">
const t = (key: string) => computed(() => $t(`${key}`));

// If your auth store uses a different field name, adjust here:
const auth = useAuthStore();
const { authUser } = storeToRefs(auth);
const shopId = computed(() => authUser.value?.shopId);

const loading = ref(true);
const error = ref<string | null>(null);

// Summary metrics
const totalRevenue = ref(0); // from invoices (after discounts)
const extraIncome = ref(0); // from store_entries.kind = 'income'
const totalExpenses = ref(0); // from store_entries.kind = 'expense'
const profit = computed(
  () => totalRevenue.value + extraIncome.value - totalExpenses.value
);
const invoiceCount = ref(0);

// Charts data
const revenueLineData = ref<any>(null);
const incomeExpenseBarData = ref<any>(null);
const invoiceKindDonutData = ref<any>(null);

const chartOptions = ref<any>({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#4b5563',
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#6b7280' },
      grid: { color: '#e5e7eb' },
    },
    y: {
      ticks: { color: '#6b7280' },
      grid: { color: '#e5e7eb' },
    },
  },
});

const loadDashboard = async () => {
  if (!shopId.value) return;
  loading.value = true;
  error.value = null;

  try {
    const now = new Date();
    const since = new Date();
    since.setDate(now.getDate() - 29); // last 30 days

    // 1) Invoices for this shop
    const { data: invoices, error: invError } = await supabase()
      .from('invoices')
      .select('id, total, discount, extra_discount, created_at, kind')
      .eq('shop_id', shopId.value)
      .is('deleted_at', null)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (invError) throw invError;

    // 2) Store entries (income/expense)
    const { data: entries, error: entError } = await supabase()
      .from('store_entries')
      .select('amount, kind, created_at')
      .eq('shop_id', shopId.value)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (entError) throw entError;

    // --- Aggregate invoices ---
    invoiceCount.value = invoices?.length || 0;

    const perDayRevenue = new Map<string, number>();
    const kindTotals: Record<string, number> = {
      product: 0,
      service: 0,
      mixed: 0,
    };

    let revenueSum = 0;
    let discountSum = 0;

    (invoices || []).forEach(inv => {
      const created = new Date(inv.created_at);
      const dateKey = created.toISOString().slice(0, 10); // YYYY-MM-DD

      const invoiceGross = Number(inv.total || 0);
      const invoiceDiscount =
        Number(inv.discount || 0) + Number(inv.extra_discount || 0);
      const invoiceNet = invoiceGross - invoiceDiscount;

      revenueSum += invoiceNet;
      discountSum += invoiceDiscount;

      perDayRevenue.set(
        dateKey,
        (perDayRevenue.get(dateKey) || 0) + invoiceNet
      );

      const k = inv.kind || 'product';
      if (kindTotals[k] !== undefined) {
        kindTotals[k] += invoiceNet;
      } else {
        kindTotals[k] = invoiceNet;
      }
    });

    totalRevenue.value = revenueSum;

    // --- Aggregate store_entries ---
    const perDayIncome: Record<string, number> = {};
    const perDayExpense: Record<string, number> = {};

    let incomeSum = 0;
    let expenseSum = 0;

    (entries || []).forEach(entry => {
      const amount = Number(entry.amount || 0);
      const created = new Date(entry.created_at);
      const dateKey = created.toISOString().slice(0, 10);

      if (entry.kind === 'income') {
        incomeSum += amount;
        perDayIncome[dateKey] = (perDayIncome[dateKey] || 0) + amount;
      } else if (entry.kind === 'expense') {
        expenseSum += amount;
        perDayExpense[dateKey] = (perDayExpense[dateKey] || 0) + amount;
      }
    });

    extraIncome.value = incomeSum;
    totalExpenses.value = expenseSum;

    // --- Build labels for last 30 days ---
    const labels: string[] = [];
    const revenueSeries: number[] = [];
    const incomeSeries: number[] = [];
    const expenseSeries: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      labels.push(dateKey);

      revenueSeries.push(perDayRevenue.get(dateKey) || 0);
      incomeSeries.push(perDayIncome[dateKey] || 0);
      expenseSeries.push(perDayExpense[dateKey] || 0);
    }

    // --- Set up charts ---

    // Revenue line chart
    revenueLineData.value = {
      labels,
      datasets: [
        {
          label: t('Revenue (after discounts)'),
          data: revenueSeries,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.3,
        },
      ],
    };

    // Income vs Expense bar chart
    incomeExpenseBarData.value = {
      labels,
      datasets: [
        {
          label: t('Extra income'),
          data: incomeSeries,
          backgroundColor: '#22c55e',
        },
        {
          label: t('Expenses'),
          data: expenseSeries,
          backgroundColor: '#ef4444',
        },
      ],
    };

    // Invoice kind donut chart
    const kindLabels = Object.keys(kindTotals);
    const kindValues = kindLabels.map(k => kindTotals[k]);

    invoiceKindDonutData.value = {
      labels: kindLabels.map(k => t(`invoice_kind_${k}`).value || k),
      datasets: [
        {
          data: kindValues,
          backgroundColor: ['#3b82f6', '#a855f7', '#f97316'],
        },
      ],
    };
  } catch (e: any) {
    console.error(e);
    error.value = e.message || 'Failed to load dashboard';
  } finally {
    loading.value = false;
  }
};

onMounted(loadDashboard);
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold mb-2">
      {{ $t('dashboard') }}
    </h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else class="space-y-6">
      <!-- Summary cards -->
      <div class="grid gap-4 pb-14 md:grid-cols-4">
        <div class="bg-white rounded-lg shadow p-4 pb-14">
          <p class="text-xs text-gray-500 mb-1">Invoices (last 30 days)</p>
          <p class="text-2xl font-semibold">{{ invoiceCount }}</p>
        </div>

        <div class="bg-white rounded-lg shadow p-4 pb-14">
          <p class="text-xs text-gray-500 mb-1">Revenue (after discounts)</p>
          <p class="text-2xl font-semibold">
            {{ totalRevenue.toFixed(2) }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4 pb-14">
          <p class="text-xs text-gray-500 mb-1">Extra income</p>
          <p class="text-2xl font-semibold">
            {{ extraIncome.toFixed(2) }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4 pb-14">
          <p class="text-xs text-gray-500 mb-1">Profit</p>
          <p
            class="text-2xl font-semibold"
            :class="profit >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ profit.toFixed(2) }}
          </p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Revenue line -->
        <div class="bg-white rounded-lg shadow p-4 pb-14 lg:col-span-2 h-80">
          <h2 class="text-sm font-semibold mb-2">Revenue (last 30 days)</h2>
          <Chart
            v-if="revenueLineData"
            type="line"
            :data="revenueLineData"
            :options="chartOptions"
            class="h-full"
          />
          <div v-else class="text-gray-400 text-sm">No data</div>
        </div>

        <!-- Invoice kinds donut -->
        <div class="bg-white rounded-lg shadow p-4 pb-14 h-80">
          <h2 class="text-sm font-semibold mb-2">Invoice types</h2>
          <Chart
            v-if="invoiceKindDonutData"
            type="doughnut"
            :data="invoiceKindDonutData"
            :options="{ responsive: true, maintainAspectRatio: false }"
            class="h-full"
          />
          <div v-else class="text-gray-400 text-sm">No data</div>
        </div>

        <!-- Income vs expenses -->
        <div class="bg-white rounded-lg shadow p-4 pb-14 lg:col-span-3 h-80">
          <h2 class="text-sm font-semibold mb-2">Extra income vs expenses</h2>
          <Chart
            v-if="incomeExpenseBarData"
            type="bar"
            :data="incomeExpenseBarData"
            :options="chartOptions"
            class="h-full"
          />
          <div v-else class="text-gray-400 text-sm">No data</div>
        </div>
      </div>
    </div>
  </div>
</template>
