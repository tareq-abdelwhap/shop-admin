<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { Drawer } from 'primevue';

const { authUser, isOwner } = storeToRefs(useAuthStore());

const route = useRoute();

const collapsed = useCookie<boolean>('collapsed');

const menu = [
  { label: 'dashboard', icon: 'pi pi-chart-line', to: '/dashboard' },
  ...(isOwner.value
    ? [{ label: 'employees', icon: 'pi pi-users', to: '/employees' }]
    : []),
  { label: 'services', icon: 'pi pi-barcode', to: '/services' },
  { label: 'products', icon: 'pi pi-box', to: '/products' },
  { label: 'invoices_clients', icon: 'pi pi-receipt', to: '/invoices/clients' },
  { label: 'invoices_vendors', icon: 'pi pi-receipt', to: '/invoices/vendors' },
];

const pageTitle = computed(() => {
  const item = menu.find(m => route.path.startsWith(m.to));
  return item ? $t(item.label) : 'CRM';
});

const isMobile = useMediaQuery('(max-width: 768px)');
</script>

<template>
  <div
    class="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-zinc-950 p-4 gap-4"
  >
    <!-- Mobile Drawer -->

    <component
      :is="isMobile ? Drawer : 'div'"
      v-model:visible="collapsed"
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
      <AppHeader :title="pageTitle" @toggle-mobile="collapsed = true" />

      <main class="p-4 flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
