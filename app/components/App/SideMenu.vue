<script setup lang="ts">
interface MenuItem {
  label: string;
  icon: string;
  to: string;
}
const { isMobile } = defineProps<{
  menuItems: MenuItem[];
  isMobile?: boolean; // NEW
}>();

const collapsed = isMobile ? ref(false) : useCookie<boolean>('collapsed');

const toggleSidebar = () => (collapsed.value = !collapsed.value);

const route = useRoute();
const auth = useAuthStore();
const { authUser } = storeToRefs(auth);

const logout = async () => {
  await supabase().auth.signOut();
  auth.setUser(null);
  navigateTo('/auth/login');
};
</script>

<template>
  <div
    :class="[
      'flex flex-col overflow-hidden',
      'bg-slate-300 text-gray-900 dark:bg-gray-800 dark:text-white',
      'rounded-lg shadow-md',
      'w-full h-full',
      collapsed ? 'md:w-16' : 'md:w-64',
      'transition-[width] duration-300',
    ]"
  >
    <!-- Header -->
    <div
      :class="[
        'hidden md:flex',
        'items-center justify-between p-3 border-b dark:border-gray-700 min-h-[60px]',
      ]"
    >
      <transition name="fade">
        <span v-if="!collapsed" class="font-semibold text-lg truncate">
          {{ authUser?.shopName?.toUpperCase() }}
        </span>
      </transition>

      <!-- Only show collapse button on desktop -->
      <Button
        :icon="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
        text
        rounded
        class="hover:bg-gray-200 dark:hover:bg-gray-700 rtl:rotate-180"
        @click="toggleSidebar"
      />
    </div>

    <!-- Navigation -->
    <nav
      class="flex-1 overflow-y-auto py-2"
      :class="collapsed ? 'px-2' : 'px-3'"
    >
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg cursor-pointer mb-1"
        :class="[
          collapsed ? 'justify-center p-3' : 'px-4 py-2',
          'hover:bg-gray-200 dark:hover:bg-gray-700 transition',
          route.path.startsWith(item.to) &&
            'font-bold text-green-600 dark:text-green-400',
        ]"
      >
        <i :class="['pi', item.icon, 'text-lg w-5 text-center']" />
        <transition name="fade">
          <span v-if="!collapsed">{{ $t(item.label) }}</span>
        </transition>
      </NuxtLink>
    </nav>

    <!-- Logout -->
    <div class="p-3 border-t dark:border-gray-700">
      <NuxtLink
        @click="logout"
        class="flex items-center gap-3 rounded-lg text-red-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="collapsed ? 'justify-center p-3' : 'px-4 py-2'"
      >
        <i class="pi pi-sign-out text-lg w-5 text-center"></i>
        <transition name="fade">
          <span v-if="!collapsed">{{ $t('logout') }}</span>
        </transition>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: width 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  width: 0;
}
</style>
