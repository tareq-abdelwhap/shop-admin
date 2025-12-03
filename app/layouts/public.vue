<!-- layouts/public.vue -->
<script setup lang="ts">
const { locale } = useI18n();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950">
    <!-- Simple top nav -->
    <header
      class="w-full border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur"
    >
      <div
        class="max-w-5xl mx-auto flex items-center justify-between px-4 py-3"
      >
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="font-bold text-lg tracking-tight">Shop CRM</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm hover:underline">
            Login
          </NuxtLink>
          <NuxtLink
            to="/auth/signup"
            class="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-slate-200 dark:border-gray-800 py-4 mt-8 text-center text-xs text-slate-500"
    >
      © {{ new Date().getFullYear() }} Shop CRM. All rights reserved.
    </footer>
  </div>
</template>
