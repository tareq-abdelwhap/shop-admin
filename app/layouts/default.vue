<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { Drawer } from 'primevue';

const { authUser } = storeToRefs(useAuthStore());

const route = useRoute();
const { t } = useI18n();
const { isOwner } = storeToRefs(useShopStore());

const isMobileMenuOpen = ref(false); // NEW

const menu = [
  { label: 'dashboard', icon: 'pi-chart-line', to: '/dashboard' },
  ...(isOwner.value
    ? [{ label: 'employees', icon: 'pi-users', to: '/employees' }]
    : []),
  { label: 'services', icon: 'pi-barcode', to: '/services' },
  { label: 'invoices', icon: 'pi-receipt', to: '/invoices' },
  { label: 'income', icon: 'pi-dollar', to: '/income' },
  { label: 'profile', icon: 'pi-user-edit', to: '/profile' },
];

const pageTitle = computed(() => {
  const item = menu.find(m => route.path.startsWith(m.to));
  return item ? t(item.label) : 'CRM';
});

const isMobile = useMediaQuery('(max-width: 768px)');
</script>

<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-950 p-4 gap-4"
  >
    <!-- Mobile Drawer -->

    <component
      :is="isMobile ? Drawer : 'div'"
      v-model:visible="isMobileMenuOpen"
      position="left"
      :header="authUser?.shopName?.toUpperCase()"
      :class="[isMobile && 'w-64']"
    >
      <AppSideMenu :menu-items="menu" :is-mobile />
    </component>

    <!-- Desktop Sidebar -->
    <!-- <div class="hidden md:block">
      <AppSideMenu :menu-items="menu" />
    </div> -->

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header (now has hamburger) -->
      <AppHeader :title="pageTitle" @toggle-mobile="isMobileMenuOpen = true" />

      <main class="p-4 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
