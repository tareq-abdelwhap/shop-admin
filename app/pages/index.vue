<script setup lang="ts">
definePageMeta({ layout: 'public' });

const subStore = useSubscriptionStore();
const { plans } = storeToRefs(subStore);
subStore.getPlans();

const isSigupOpen = ref(false);
const plan = ref<any>(null);
const goToSignup = (planKey: string) => {
  // return navigateTo({ path: `/auth/signup`, state: { plan: planKey } });
  plan.value = plans.value?.data?.find(p => p.key === planKey);
  isSigupOpen.value = true;
};

const formatPrice = (p: number, c: string) => `${p} ${c}/month`;
</script>

<template>
  <div class="landing">
    <!-- ======================== -->
    <!-- HERO SECTION             -->
    <!-- ======================== -->
    <section
      class="hero py-20 text-center px-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <h1
        class="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto"
      >
        Manage Your Shop With
        <span class="text-blue-600">Clarity, Speed</span> &
        <span class="text-emerald-600">Confidence</span>
      </h1>

      <p
        class="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
      >
        A complete CRM for barbers, electricians, and small-business owners.
        Handle invoices, employees, services, expenses, and full inventory
        management — all in one place.
      </p>

      <div class="flex justify-center gap-4 mt-8">
        <!-- Smooth scroll to pricing -->
        <NuxtLink
          to="#pricing"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow"
        >
          View Plans
        </NuxtLink>

        <NuxtLink
          to="/auth/login"
          class="px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-gray-800"
        >
          Login
        </NuxtLink>
      </div>
    </section>

    <!-- ======================== -->
    <!-- PROBLEM → SOLUTION       -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-3xl font-bold mb-4">Running a Shop is Hard…</h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            Papers get lost. Calculations go wrong. Employees forget details.
            And inventory tracking becomes a nightmare.
          </p>

          <p class="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            <strong>We fix all of that.</strong>
            With a single CRM that automates invoices, stock, discounts, profit,
            employees, and reports.
          </p>
        </div>

        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
            alt=""
            class="w-80 mx-auto opacity-90"
          />
        </div>
      </div>
    </section>

    <!-- ======================== -->
    <!-- FEATURE GRID             -->
    <!-- ======================== -->
    <section
      class="py-16 px-4 bg-slate-50 dark:bg-gray-900 border-y border-slate-200/50 dark:border-gray-800"
    >
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold mb-2">
          Everything You Need in One Place
        </h2>
        <p class="text-slate-600 dark:text-slate-300">
          Replace 10 apps with one clean, fast CRM built for small shops.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <FeatureCard
          icon="pi pi-receipt"
          title="Invoices & Services"
          desc="Create, print, and track invoices. Add discounts, services, and work with full math accuracy."
        />
        <FeatureCard
          icon="pi pi-users"
          title="Employees & Permissions"
          desc="Add employees, restrict access, and track who handles each invoice."
        />
        <FeatureCard
          icon="pi pi-chart-line"
          title="Dashboard & Reports"
          desc="Revenue, profit, COGS, FIFO tracking, and daily sales visualized beautifully."
        />
        <FeatureCard
          icon="pi pi-shop"
          title="Multi-Shop Support"
          desc="Manage multiple shops under one account with separate permissions."
        />
        <FeatureCard
          icon="pi pi-dollar"
          title="Expenses & Income"
          desc="Record electricity bills, salaries, purchases, and track real profit."
        />
        <FeatureCard
          icon="pi pi-database"
          title="Inventory (Pro Only)"
          desc="Full FIFO stock control. Vendor invoices update stock automatically. Never lose track again."
        />
      </div>
    </section>

    <!-- ======================== -->
    <!-- INVENTORY HIGHLIGHT      -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
            class="w-80 mx-auto opacity-90"
          />
        </div>

        <div>
          <h2 class="text-3xl font-bold mb-4">Inventory & Stock (Pro Plan)</h2>

          <p class="text-slate-600 dark:text-slate-300 mb-3">
            Our FIFO engine tracks stock, COGS, vendor purchases, and profit
            automatically.
          </p>

          <ul class="space-y-2 text-slate-700 dark:text-slate-300">
            <li>✓ Automatic stock increase with vendor invoices</li>
            <li>✓ Automatic stock deduction on client invoices</li>
            <li>✓ FIFO-based COGS & profit</li>
            <li>✓ Batch-level cost tracking</li>
            <li>✓ Low stock alerts</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ======================== -->
    <!-- TESTIMONIALS             -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-slate-50 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold mb-2">Loved by Small Business Owners</h2>
        <p class="text-slate-600 dark:text-slate-300">
          Real results from real shops.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Testimonial
          quote="This CRM saved me 2 hours daily. The dashboard alone is worth it."
          name="Mohammed"
          role="Barbershop Owner"
        />
        <Testimonial
          quote="Finally, a clean system for invoices and inventory. No more papers!"
          name="Ahmed"
          role="Electric Shop Owner"
        />
        <Testimonial
          quote="Employee permissions + printed invoices is perfect for my store."
          name="Sarah"
          role="Beauty Salon Manager"
        />
      </div>
    </section>

    <!-- ======================== -->
    <!-- PRICING SECTION          -->
    <!-- ======================== -->
    <section id="pricing" class="py-20 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold">Pricing</h2>
        <p class="text-slate-600 dark:text-slate-300 mt-1">
          Pick a plan. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div v-if="plans.loading" class="text-center text-slate-500">
        Loading...
      </div>

      <div v-else class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div
          v-for="plan in plans.data"
          :key="plan.id"
          class="flex flex-col rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 shadow-lg p-6"
          :class="plan.key === 'pro' ? 'ring-2 ring-blue-500' : ''"
        >
          <h3 class="text-xl font-bold">{{ plan.name }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {{ plan.description }}
          </p>

          <div class="flex items-end justify-between gap-1">
            <p class="text-3xl font-extrabold mt-4">
              {{ formatPrice(plan.price_monthly, plan.currency) }}
            </p>

            <span
              v-if="plan.trial_days > 0"
              class="mt-1 inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3 py-1 rounded-full"
            >
              {{ plan.trial_days }}-day free trial
            </span>
          </div>

          <ul class="mt-6 text-sm space-y-1 text-slate-600 dark:text-slate-300">
            <li>✓ All core features</li>
            <li v-if="plan.key === 'basic'">✕ Inventory module</li>
            <li v-else>✓ Inventory module</li>
          </ul>

          <button
            class="mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            @click="goToSignup(plan.key)"
          >
            Choose {{ plan.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- ======================== -->
    <!-- FAQ SECTION              -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-slate-50 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold">FAQ</h2>
      </div>

      <div class="max-w-4xl mx-auto space-y-4">
        <FAQ
          q="Do I need a credit card for the free trial?"
          a="No. The Basic plan's 3-day free trial does not require a payment method."
        />
        <FAQ
          q="Can I upgrade later?"
          a="Yes. You can switch from Basic to Pro anytime."
        />
        <FAQ
          q="Does the Pro plan include inventory tracking?"
          a="Yes. Pro unlocks full FIFO inventory and vendor purchases."
        />
        <FAQ
          q="Can I use this for multiple shops?"
          a="Yes. You can manage multiple shops under one account."
        />
      </div>
    </section>

    <!-- ======================== -->
    <!-- FINAL CTA               -->
    <!-- ======================== -->
    <section class="py-20 text-center bg-white dark:bg-gray-950">
      <h2 class="text-3xl font-bold mb-4">Start Today</h2>
      <p class="text-slate-600 dark:text-slate-300 mb-6">
        Join shops that upgraded their workflow. Create your account in seconds.
      </p>

      <NuxtLink
        to="#pricing"
        class="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        Choose a Plan
      </NuxtLink>
    </section>

    <Dialog
      v-model:visible="isSigupOpen"
      modal
      :header="$t('createYourAccount')"
      :style="{ width: '35rem' }"
    >
      <AuthSignup :plan />
    </Dialog>
  </div>
</template>

<style scoped>
.landing {
  overflow-x: hidden;
}
</style>
