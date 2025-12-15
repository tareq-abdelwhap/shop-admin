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

const isLoginOpen = ref(false);
const goToLogin = () => (isLoginOpen.value = true);

const formatPrice = (p: number, c: string) =>
  // computed(() => `${p} ${c}/${$t('month')}`);
  computed(() => `${useFormatPrice(p)} ${$t(c)}/${$t('month')}`);
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
        {{ $t('manageYourShopWith') }}
        <span class="text-blue-600">{{ $t('claritySpeed') }}</span>
        {{ $t('&') }}
        <span class="text-emerald-600">{{ $t('confidence') }}</span>
      </h1>

      <p
        class="text-lg text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto"
      >
        {{ $t('allInOneCRMForSmallShops') }}
      </p>

      <div class="flex justify-center gap-4 mt-8">
        <!-- Smooth scroll to pricing -->
        <NuxtLink
          to="#pricing"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow"
        >
          {{ $t('chooseAPlan') }}
        </NuxtLink>

        <Button
          type="button"
          :label="$t('login')"
          outlined
          class="rounded-xl text-sm font-medium px-6 py-3"
          @click="() => goToLogin()"
        />
      </div>
    </section>

    <!-- ======================== -->
    <!-- PROBLEM → SOLUTION       -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-3xl font-bold mb-4">{{ $t('problem') }}</h2>
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ $t('runningAShopIsHard') }}
          </p>

          <p class="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            <strong>{{ $t('solution') }}</strong>
            {{ $t('weFixAllOfThat') }}
          </p>
        </div>

        <div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/8771/8771926.png"
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
          {{ $t('allTheFeaturesYouNeed') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300">
          {{ $t('designedForSmallBusiness') }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <FeatureCard
          icon="pi pi-receipt"
          :title="$t('invoicesFeature')"
          :desc="$t('createProfessionalInvoices')"
        />
        <FeatureCard
          icon="pi pi-users"
          :title="$t('employeeManagement')"
          :desc="$t('manageEmployeePermissions')"
        />
        <FeatureCard
          icon="pi pi-chart-line"
          :title="$t('analyticsFeature')"
          :desc="$t('detailedSalesReports')"
        />
        <!-- <FeatureCard
          icon="pi pi-shop"
          :title="$t('multipleShops')"
          :desc="$t('manageMultipleShops')"
        /> -->
        <FeatureCard
          icon="pi pi-dollar"
          :title="$t('expensesFeature')"
          :desc="$t('trackYourExpenses')"
        />
        <FeatureCard
          icon="pi pi-database"
          :title="$t('inventoryFeature')"
          :desc="$t('fifoInventoryTracking')"
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
          <h2 class="text-3xl font-bold mb-4">{{ $t('inventoryFeature') }}</h2>

          <p class="text-slate-600 dark:text-slate-300 mb-3">
            {{ $t('manageYourStockWithFIFO') }}
          </p>

          <ul class="space-y-2 text-slate-700 dark:text-slate-300">
            <li>✓ {{ $t('inventoryFeature01') }}</li>
            <li>✓ {{ $t('inventoryFeature02') }}</li>
            <li>✓ {{ $t('inventoryFeature03') }}</li>
            <li>✓ {{ $t('inventoryFeature04') }}</li>
            <!-- <li>✓ {{ $t('inventoryFeature05') }}</li> -->
          </ul>
        </div>
      </div>
    </section>

    <!-- ======================== -->
    <!-- TESTIMONIALS             -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-slate-50 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold mb-2">{{ $t('testimonials') }}</h2>
        <p class="text-slate-600 dark:text-slate-300">
          {{ $t('whatOurUsersSay') }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Testimonial
          :quote="$t('testimonial1')"
          :name="$t('testimonial1Name')"
          :role="$t('testimonial1Role')"
        />
        <Testimonial
          :quote="$t('testimonial2')"
          :name="$t('testimonial2Name')"
          :role="$t('testimonial2Role')"
        />
        <!-- <Testimonial
          :quote="$t('testimonial3')"
          :name="$t('testimonial3Name')"
          :role="$t('testimonial3Role')"
        /> -->
      </div>
    </section>

    <!-- ======================== -->
    <!-- PRICING SECTION          -->
    <!-- ======================== -->
    <section id="pricing" class="py-20 px-4 bg-white dark:bg-gray-950">
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold">{{ $t('pricing') }}</h2>
        <p class="text-slate-600 dark:text-slate-300 mt-1">
          {{ $t('chooseThePlanThatFits') }}
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
          <h3 class="text-xl font-bold">{{ $t(plan.key) }}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {{ $t(`${plan.key}Description`) }}
          </p>

          <div class="flex items-end justify-between gap-1 mt-4">
            <p class="text-3xl font-extrabold">
              {{ formatPrice(plan.price_monthly, plan.currency.toLowerCase()) }}
            </p>

            <span
              v-if="plan.trial_days > 0"
              class="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3 py-1 rounded-full"
            >
              {{ plan.trial_days }} - {{ $t('dayFreeTrial') }}
            </span>
          </div>

          <ul class="mt-6 text-sm space-y-1 text-slate-600 dark:text-slate-300">
            <li>✓ {{ $t('coreFeatures') }}</li>

            <li>
              {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
              {{ $t('inventoryFeature01') }}
            </li>
            <li>
              {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
              {{ $t('inventoryFeature02') }}
            </li>
            <li>
              {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
              {{ $t('inventoryFeature03') }}
            </li>
            <li>
              {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
              {{ $t('inventoryFeature04') }}
            </li>
          </ul>

          <button
            class="mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
            @click="() => goToSignup(plan.key)"
          >
            {{ $t('choose') }} {{ $t(plan.key) }}
          </button>
        </div>
      </div>
    </section>

    <!-- ======================== -->
    <!-- FAQ SECTION              -->
    <!-- ======================== -->
    <section class="py-16 px-4 bg-slate-50 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto text-center mb-10">
        <h2 class="text-3xl font-bold">{{ $t('faq') }}</h2>
      </div>

      <div class="max-w-4xl mx-auto space-y-4">
        <FAQ :q="$t('faq1Question')" :a="$t('faq1Answer')" />
        <FAQ :q="$t('faq2Question')" :a="$t('faq2Answer')" />
        <FAQ :q="$t('faq3Question')" :a="$t('faq3Answer')" />
        <!-- <FAQ :q="$t('faq4Question')" :a="$t('faq4Answer')" /> -->
      </div>
    </section>

    <!-- ======================== -->
    <!-- FINAL CTA               -->
    <!-- ======================== -->
    <section class="py-20 text-center bg-white dark:bg-gray-950">
      <h2 class="text-3xl font-bold mb-4">{{ $t('getStarted') }}</h2>
      <p class="text-slate-600 dark:text-slate-300 mb-6">
        {{ $t('readyToManageYourShop') }}
      </p>

      <NuxtLink
        to="#pricing"
        class="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
      >
        {{ $t('chooseAPlan') }}
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

    <Dialog
      v-model:visible="isLoginOpen"
      modal
      :header="$t('login')"
      :style="{ width: '35rem' }"
    >
      <AuthLogin />
    </Dialog>
  </div>
</template>

<style scoped>
.landing {
  overflow-x: hidden;
}
</style>
