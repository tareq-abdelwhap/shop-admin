<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const sessionId = route.query.session_id;

// Call server to verify subscription
await $fetch('/api/billing/verify', { method: 'POST', body: { sessionId } });
</script>

<template>
  <div class="p-10 text-center">
    <h1 class="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
    <p>Your subscription is now active.</p>
    <NuxtLink to="/dashboard" class="text-blue-600 underline"
      >Go to Dashboard</NuxtLink
    >
  </div>
</template>
