// server/api/billing/checkout.post.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async event => {
  const body = await readBody<{
    planKey: string;
    shopId: string;
  }>(event);

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2023-10-16',
  });

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // service role (server only!)
  );

  // 1) get plan
  const { data: plan, error: planErr } = await supabase
    .from('plans')
    .select('*')
    .eq('key', body.planKey)
    .single();

  if (planErr || !plan) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid plan' });
  }

  if (!plan.stripe_price_id) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Plan not configured for billing',
    });
  }

  // 2) get subscription row
  const { data: sub, error: subErr } = await supabase
    .from('shop_subscriptions')
    .select('*')
    .eq('shop_id', body.shopId)
    .single();

  if (subErr || !sub) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Subscription not found',
    });
  }

  // TODO: fetch or create Stripe customer for this shop/user
  // For now, we can just create a new customer:
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: plan.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: 'https://yourapp.com/billing/success',
    cancel_url: 'https://yourapp.com/billing/cancel',
  });

  // 3) store stripe data
  await supabase
    .from('shop_subscriptions')
    .update({
      stripe_price_id: plan.stripe_price_id,
      stripe_subscription_id: null, // will fill via webhook
      status: 'pending_payment',
    })
    .eq('id', sub.id);

  return { url: session.url };
});
