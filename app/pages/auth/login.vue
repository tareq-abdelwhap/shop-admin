<script setup>
definePageMeta({ layout: false });

const email = ref('');
const password = ref('');

const authStore = useAuthStore();
const { error } = storeToRefs(authStore);

const login = async () => authStore.login(email.value, password.value);
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-6 shadow rounded w-80">
      <h1 class="text-xl font-bold mb-4">{{ $t('login') }}</h1>

      <input
        v-model="email"
        type="email"
        required
        class="w-full border px-3 py-2 rounded mb-3"
        :placeholder="$t('email')"
      />

      <input
        v-model="password"
        type="password"
        required
        class="w-full border px-3 py-2 rounded mb-3"
        :placeholder="$t('password')"
      />

      <button class="w-full bg-blue-600 text-white py-2 rounded">
        {{ $t('login') }}
      </button>

      <p class="text-red-500 text-sm mt-3" v-if="error">{{ error }}</p>
    </form>
  </div>
</template>
