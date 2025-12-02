<script setup lang="ts">
interface MenuItem {
  label: string;
  icon: string;
  to: string;
}

const props = defineProps<{
  menuItems: MenuItem[];
  isMobile?: boolean;
}>();

const collapsed = props.isMobile ? ref(false) : useCookie<boolean>('collapsed');

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
  <aside
    :class="[
      'h-full flex flex-col bg-white dark:bg-zinc-900 shadow-md',
      'transition-all duration-300 overflow-hidden rounded-lg',
      collapsed ? 'md:w-20' : 'md:w-64',
      'w-full',
    ]"
  >
    <!-- Header -->
    <header
      class="hidden md:flex items-center justify-between px-4 h-[60px] border-b dark:border-gray-700"
    >
      <transition name="fade-fast">
        <h2
          v-if="!collapsed"
          class="font-semibold text-lg truncate text-gray-900 dark:text-white"
          v-text="authUser?.shopName?.toUpperCase()"
        />
      </transition>
    </header>

    <!-- Menu -->
    <nav class="flex-1 py-3">
      <div v-for="item in menuItems" :key="item.to" class="group">
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-3 mx-2 mb-1 rounded-lg transition-all"
          :class="[
            'px-4 py-3',
            'hover:bg-gray-200 dark:hover:bg-gray-700 transition',
            route.path.startsWith(item.to) &&
              'font-bold text-green-600 dark:text-green-400',
          ]"
        >
          <i :class="[item.icon, 'text-xl w-6 text-center mx-auto shrink']" />

          <transition name="fade-fast">
            <span
              v-if="!collapsed"
              class="whitespace-nowrap truncate flex-1 me-auto"
              v-text="$t(item.label)"
            />
          </transition>
        </NuxtLink>
      </div>
    </nav>

    <!-- Logout -->
    <footer class="p-3 border-t dark:border-gray-700">
      <button
        @click="logout"
        class="w-full flex items-center gap-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 transition"
        :class="collapsed ? 'justify-center p-3' : 'px-4 py-3'"
      >
        <i class="pi pi-sign-out text-xl" />

        <transition name="fade-fast">
          <span
            v-if="!collapsed"
            class="whitespace-nowrap"
            v-text="$t('logout')"
          />
        </transition>
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>
