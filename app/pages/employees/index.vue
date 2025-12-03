<script setup lang="ts">
const { authUser } = storeToRefs(useAuthStore());

const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'full_name', header: t('name'), sortable: true },
  { field: 'email', header: t('email'), sortable: true },
  { field: 'role', header: t('role'), sortable: true },
];

const fields = ref<Field[]>([
  { key: 'id', label: t('id'), type: 'text', value: null, hide: true },
  {
    key: 'user_id',
    label: t('user_id'),
    type: 'text',
    value: null,
    hide: true,
  },
  { key: 'full_name', label: t('name'), type: 'text', value: null },
  { key: 'email', label: t('email'), type: 'email', value: null },
  { key: 'password', label: t('password'), type: 'password', value: null },
  {
    key: 'role',
    label: t('role'),
    type: 'text',
    value: 'employee',
    hide: true,
  },
]);

/* Adding Member */
const createFields = ref(JSON.parse(JSON.stringify(fields.value)));
const addMember = async () => {
  await $fetch('/api/employees/add', {
    method: 'POST',
    body: {
      shop_id: authUser.value?.shopId,
      full_name: getField('full_name')?.value,
      email: getField('email')?.value,
      password: getField('password')?.value,
      role: 'employee',
    },
  });
};

const editFields = ref(JSON.parse(JSON.stringify(fields.value)));
const editMember = async (member?: any, confirmed?: boolean) => {
  await $fetch('/api/employees/edit', {
    method: 'POST',
    body: {
      user_id: member.value.user_id,
      full_name: getField('full_name', editFields.value)?.value,
      email: getField('email', editFields.value)?.value,
      ...(getField('password', editFields.value)?.value
        ? { password: getField('password', editFields.value)?.value }
        : {}),
    },
  });
};

function getField(key: string, _fields = createFields.value) {
  return _fields.find((f: any) => f.key === key) || { value: '', label: '' };
}
</script>

<template>
  <Page
    module="shop_members"
    select="id, user_id, role, full_name, email, deleted_at"
    :columns
    :fields
    :add-validation-exceptions="['password', 'user_id', 'id']"
    :edit-validation-exceptions="['password', 'user_id', 'id']"
    custom-add-api="/api/employees/add"
    custom-edit-api="/api/employees/edit"
    with-add-button
    with-edit-button
    with-delete-button
  />
</template>
