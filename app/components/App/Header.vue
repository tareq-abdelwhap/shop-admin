<script lang="ts" setup>
const { locales, setLocale, locale: i18nLocale } = useI18n();
const locale = ref(i18nLocale.value);

defineProps<{ title: string }>();
const emit = defineEmits(['toggle-mobile']); // NEW
</script>

<template>
  <header
    class="h-16 bg-white shadow-md text-gray-900 dark:bg-gray-800 dark:text-white rounded-lg flex items-center justify-between px-4 md:px-6"
  >
    <!-- LEFT AREA -->
    <div class="flex items-center gap-4">
      <!-- MOBILE MENU BUTTON -->
      <Button
        icon="pi pi-bars"
        class="md:hidden"
        severity="secondary"
        text
        rounded
        @click="() => emit('toggle-mobile')"
      />

      <!-- PAGE TITLE -->
      <h1 class="text-xl font-semibold">{{ title }}</h1>
    </div>

    <!-- RIGHT AREA -->
    <div class="flex items-center gap-4">
      <Select
        v-model="locale"
        :options="locales"
        optionValue="code"
        optionLabel="name"
        size="small"
        @change="() => setLocale(locale)"
      />

      <AppColorModeSwitcher />
    </div>
  </header>
</template>
