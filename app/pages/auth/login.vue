<script setup lang="ts">
definePageMeta({ layout: false });

const t = (key: string) => computed(() => $t(`${key}`));

const fields = ref([
  { key: 'email', label: t('email'), type: 'email', value: '' },
  { key: 'password', label: t('password'), type: 'password', value: '' },
]);

const submitting = ref(false);

const login = async () => {
  submitting.value = true;
  await useAuthStore().login(
    getField('email')!.value,
    getField('password')!.value
  );
  submitting.value = false;
};

const getField = (key: string) => fields.value.find(f => f.key === key);
</script>

<template>
  <div
    :class="[
      'relative min-h-screen',
      'flex items-center justify-center',
      'bg-gray-100 dark:bg-zinc-950',
    ]"
  >
    <div class="flex items-center gap-4 absolute top-4 end-4">
      <AppLanguageSwitcher />
      <AppColorModeSwitcher />
    </div>

    <Card class="w-full mx-3 max-w-xl md:px-8 md:scale-110 rounded-3xl">
      <template #title>
        <div class="flex items-center justify-center py-6">
          <h1 class="text-2xl font-semibold" v-text="$t('login')" />
        </div>
      </template>

      <template #content>
        <AppForm
          v-model="fields"
          :submitting
          :submit-label="$t('login')"
          field-size="large"
          class="!gap-12"
          @submit="() => login()"
        />
      </template>
    </Card>
  </div>
</template>
