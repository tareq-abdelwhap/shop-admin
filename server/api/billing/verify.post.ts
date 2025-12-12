import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export default defineEventHandler(async event => {
  const { sessionId } = await readBody(event);

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // service role (server only!)
  );

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });

  const subscription = session.subscription as Stripe.Subscription & {
    current_period_start: number;
    current_period_end: number;
  };

  console.log('Verifying subscription:', subscription);

  const shopId = session.metadata?.shop_id;
  const planId = session.metadata?.plan_id;
  const stripePriceId = session.metadata?.stripe_price_id;

  // Store subscription in Supabase
  await supabase.from('shop_subscriptions').upsert(
    {
      shop_id: shopId,
      plan_id: planId,
      status: subscription.status,

      current_period_start: new Date(subscription.start_date * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),

      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,

      stripe_price_id: stripePriceId,
    },
    { onConflict: 'shop_id' }
  );

  return { success: true };
});

// const Object = {
//   id: 'sub_1SdGOtJmxtT9ICNe5MuaPJn3',
//   object: 'subscription',
//   application: null,
//   application_fee_percent: null,
//   automatic_tax: { disabled_reason: null, enabled: false, liability: null },
//   billing_cycle_anchor: 1765484622,
//   billing_cycle_anchor_config: null,
//   billing_mode: {
//     flexible: { proration_discounts: 'included' },
//     type: 'flexible',
//     updated_at: 1765484615,
//   },
//   billing_thresholds: null,
//   cancel_at: null,
//   cancel_at_period_end: false,
//   canceled_at: null,
//   cancellation_details: { comment: null, feedback: null, reason: null },
//   collection_method: 'charge_automatically',
//   created: 1765484622,
//   currency: 'egp',
//   customer: 'cus_TaRHwBx5h6lA8R',
//   customer_account: null,
//   days_until_due: null,
//   default_payment_method: 'pm_1SdGOoJmxtT9ICNeQVR7INFN',
//   default_source: null,
//   default_tax_rates: [],
//   description: null,
//   discounts: [],
//   ended_at: null,
//   invoice_settings: { account_tax_ids: null, issuer: { type: 'self' } },
//   items: {
//     object: 'list',
//     data: [[]],
//     has_more: false,
//     total_count: 1,
//     url: '/v1/subscription_items?subscription=sub_1SdGOtJmxtT9ICNe5MuaPJn3',
//   },
//   latest_invoice: 'in_1SdGOpJmxtT9ICNepCKeKlsE',
//   livemode: false,
//   metadata: {},
//   next_pending_invoice_item_invoice: null,
//   on_behalf_of: null,
//   pause_collection: null,
//   payment_settings: {
//     payment_method_options: {
//       acss_debit: null,
//       bancontact: null,
//       card: [],
//       customer_balance: null,
//       konbini: null,
//       payto: null,
//       sepa_debit: null,
//       us_bank_account: null,
//     },
//     payment_method_types: null,
//     save_default_payment_method: 'off',
//   },
//   pending_invoice_item_interval: null,
//   pending_setup_intent: null,
//   pending_update: null,
//   plan: {
//     id: 'price_1SagqMJmxtT9ICNeRDWLKmMF',
//     object: 'plan',
//     active: true,
//     amount: 90000,
//     amount_decimal: '90000',
//     billing_scheme: 'per_unit',
//     created: 1764871290,
//     currency: 'egp',
//     interval: 'month',
//     interval_count: 1,
//     livemode: false,
//     metadata: {},
//     meter: null,
//     nickname: null,
//     product: 'prod_TXmPY5hP06dId8',
//     tiers_mode: null,
//     transform_usage: null,
//     trial_period_days: null,
//     usage_type: 'licensed',
//   },
//   quantity: 1,
//   schedule: null,
//   start_date: 1765484622,
//   status: 'active',
//   test_clock: null,
//   transfer_data: null,
//   trial_end: null,
//   trial_settings: {
//     end_behavior: { missing_payment_method: 'create_invoice' },
//   },
//   trial_start: null,
// };
