<script setup lang="ts">
const type = ref('income');
const amount = ref(0);
const description = ref('');
const entries = ref([]);

const addEntry = () => {
  entries.value.push({
    type: type.value,
    amount: amount.value,
    description: description.value,
    date: new Date(),
  });

  amount.value = 0;
  description.value = '';
};
</script>

<template>
  <Container>
    <h1 class="text-2xl font-bold mb-6">{{ $t('income') }}</h1>

    <UCard class="p-6 space-y-4 mb-6">
      <UFormGroup label="Type">
        <USelect
          v-model="type"
          :options="[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ]"
        />
      </UFormGroup>

      <UFormGroup label="Amount">
        <UInput type="number" v-model.number="amount" />
      </UFormGroup>

      <UFormGroup label="Description">
        <UInput v-model="description" />
      </UFormGroup>

      <UButton @click="addEntry">Add</UButton>
    </UCard>

    <UCard class="p-6">
      <h2 class="text-lg font-semibold mb-4">Entries</h2>

      <ul class="divide-y">
        <li
          v-for="(e, i) in entries"
          :key="i"
          class="py-3 flex justify-between"
        >
          <div>
            <span class="font-semibold">
              {{ e.type === 'income' ? 'Income' : 'Expense' }}
            </span>
            — {{ e.amount }}
            <div class="text-gray-500 text-sm">{{ e.description }}</div>
          </div>

          <UButton color="red" size="xs" variant="soft"> Delete </UButton>
        </li>
      </ul>
    </UCard>
  </Container>
</template>
