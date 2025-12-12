<script lang="ts" setup>
const { plan, email, password } = defineProps<{
  plan: any;
  email: string;
  password: string;
}>();

const auth = useAuthStore();
const { setup } = storeToRefs(auth);

const OTP = ref();

const reSendOTP = () => console.log('Resend OTP clicked');

const initialValues = ref({ passcode: '' });

const resolver = ({ values }: any) => {
  const errors: any = {};

  // Object.entries(values)
  //   .filter(([key, value]) => fields.value.find(f => f.key === key))
  //   .forEach(([key, value]) => {
  //     const field = getField(key);
  //     if (!value) errors[key] = [{ message: `${field?.label} is required.` }];
  //   });

  if (!values.OTP || values.OTP.length < 6) {
    errors.OTP = [{ message: 'Please enter the 6-digit code.' }];
  }

  return { values, errors };
};

const submitting = ref(false);
const onFormSubmit = async ({ valid }: { valid: boolean }) => {
  try {
    submitting.value = true;
    if (valid) {
      await auth.verify({ email, token: OTP.value });

      if (plan.trial_days === 0) {
        // no trial, go pay now
        const res = await $fetch('/api/billing/checkout', {
          method: 'POST',
          body: { planKey: plan.key, shopId: setup.value.shop_id },
        });

        if (res?.url) {
          window.location.href = res.url;
          return;
        }
      } else {
        // else just go to app with trial
        await useAuthStore().login(email, password);
      }
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="card flex justify-start">
    <Form
      v-slot="$form"
      :resolver
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-col items-start gap-0.5"
    >
      <p class="text-surface-500 dark:text-surface-400 block">
        Please enter the code sent to your email.
      </p>

      <div class="flex items-center gap-4">
        <InputOtp
          v-model="OTP"
          name="OTP"
          :length="6"
          style="gap: 0"
          integerOnly
        >
          <template #default="{ attrs, events, index }">
            <input
              type="text"
              v-bind="attrs"
              v-on="events"
              :class="[
                'custom-otp-input',
                $form.OTP?.invalid && '!border-red-500',
              ]"
            />
            <div v-if="index === 3" class="px-4">
              <i class="pi pi-minus" />
            </div>
          </template>
        </InputOtp>

        <Button
          label="Resend Code"
          link
          class="p-0"
          @click="() => reSendOTP()"
        />
      </div>

      <Message
        v-if="$form.OTP?.invalid"
        severity="error"
        size="small"
        variant="simple"
        v-text="$form.OTP.error?.message"
      />

      <div class="flex justify-between mt-2 self-stretch">
        <Button
          type="submit"
          size="small"
          label="Submit Code"
          :loading="submitting"
        />
      </div>
    </Form>
  </div>
</template>

<style scoped>
.custom-otp-input {
  width: 48px;
  height: 48px;
  font-size: 24px;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  border-radius: 0;
  border: 1px solid var(--p-inputtext-border-color);
  background: transparent;
  outline-offset: -2px;
  outline-color: transparent;
  border-right: 0 none;
  transition: outline-color 0.3s;
  color: var(--p-inputtext-color);
}

.custom-otp-input:focus {
  outline: 2px solid var(--p-focus-ring-color);
}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-right-width: 1px;
  border-right-style: solid;
  border-color: var(--p-inputtext-border-color);
}
</style>
