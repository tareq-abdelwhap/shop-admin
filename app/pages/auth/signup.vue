<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const planKey = computed(() => (route.query.plan as string) || 'basic');

const loadingPlan = ref(true);
const plan = ref<any | null>(null);
const errorMsg = ref<string | null>(null);

const email = ref('');
const password = ref('');
const shopName = ref('');

onMounted(async () => {
  const { data, error } = await supabase()
    .from('plans')
    .select('*')
    .eq('key', planKey.value)
    .eq('is_active', true)
    .single();

  loadingPlan.value = false;
  if (error || !data) {
    errorMsg.value = 'Invalid or inactive plan.';
    return;
  }
  plan.value = data;
});

const handleSignup = async () => {
  errorMsg.value = null;

  if (!plan.value) {
    errorMsg.value = 'Plan not loaded.';
    return;
  }

  // 1) create auth user
  const client = supabase();
  const { data: signUpRes, error: signUpErr } = await client.auth.signUp({
    email: email.value,
    password: password.value,
  });

  if (signUpErr || !signUpRes.user) {
    errorMsg.value = signUpErr?.message || 'Failed to sign up.';
    return;
  }

  const user = signUpRes.user;

  // 2) call RPC to create shop + subscription etc.
  const { data: setupData, error: setupErr } = await client.rpc(
    'setup_shop_for_new_user',
    {
      p_user_id: user.id,
      p_shop_name: shopName.value,
      p_plan_key: plan.value.key,
    }
  );

  if (setupErr) {
    console.error('Setup error', setupErr);
    errorMsg.value = 'Failed to create shop. Please contact support.';
    return;
  }

  if (plan.value.trial_days === 0) {
    // no trial, go pay now
    const res = await $fetch('/api/billing/checkout', {
      method: 'POST',
      body: {
        planKey: plan.value.key,
        shopId: setupData.shop_id,
      },
    });

    if (res?.url) {
      window.location.href = res.url;
      return;
    }
  }

  // else just go to app with trial
  // 3) redirect to dashboard (or onboarding)
  await navigateTo('/dashboard');
};
</script>

<template>
  <div class="max-w-md mx-auto py-10 px-4">
    <h1 class="text-2xl font-bold mb-2">Create your account</h1>

    <p v-if="loadingPlan" class="text-sm text-slate-500">Loading plan...</p>
    <p v-else-if="!plan" class="text-sm text-red-500">Invalid plan.</p>

    <div v-if="plan" class="mb-4 text-sm text-slate-600 dark:text-slate-300">
      You selected plan: <strong>{{ plan.name }}</strong>
      <span v-if="plan.trial_days > 0">
        — includes {{ plan.trial_days }}-day free trial
      </span>
    </div>

    <form class="space-y-3" @submit.prevent="handleSignup">
      <input
        v-model="shopName"
        class="border rounded px-3 py-2 w-full"
        placeholder="Shop name"
        required
      />

      <input
        v-model="email"
        type="email"
        class="border rounded px-3 py-2 w-full"
        placeholder="Email"
        required
      />

      <input
        v-model="password"
        type="password"
        class="border rounded px-3 py-2 w-full"
        placeholder="Password"
        required
      />

      <p v-if="errorMsg" class="text-sm text-red-500">
        {{ errorMsg }}
      </p>

      <button
        type="submit"
        class="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Sign up
      </button>
    </form>
  </div>
</template>
