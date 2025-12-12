import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // service role (server only!)
  );

  const raw = await readRawBody(event);
  const sig = event.req.headers['stripe-signature'];

  const webhookSecret = config.stripeWebhookSecret!;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(raw!, sig!, webhookSecret);
  } catch (err) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid signature' });
  }

  if (stripeEvent.type === 'invoice.payment_succeeded') {
    const invoice = stripeEvent.data.object;

    await supabase
      .from('shop_subscriptions')
      .update({
        status: 'active',
        current_period_end: new Date(invoice.lines.data[0].period.end * 1000),
      })
      .eq('stripe_subscription_id', invoice.subscription);
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    const subscription = stripeEvent.data.object;
    await supabase
      .from('shop_subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id);
  }

  return { received: true };
});
