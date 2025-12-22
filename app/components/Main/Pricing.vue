<script setup lang="ts">

const emit = defineEmits<{
  (e: "plan", _plan: any): void
}>()

const subStore = useSubscriptionStore();
const { plans } = storeToRefs(subStore);
subStore.getPlans();

const formatPrice = (p: number, c: string) =>{
  return computed(() => `${useFormatPrice(p)} ${$t(c)}/${$t('month')}`);
}
</script>

<template>
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
          <p class="text-3xl font-extrabold" v-text="formatPrice(plan.price_monthly, plan.currency.toLowerCase())" />

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
          @click="() => emit('plan', plan)"
        >
          {{ $t('choose') }} {{ $t(plan.key) }}
        </button>
      </div>
    </div>
  </section>
</template>