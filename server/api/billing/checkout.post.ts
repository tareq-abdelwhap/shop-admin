// server/api/billing/checkout.post.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async event => {
  const body = await readBody<{
    planKey: string;
    shopId: string;
  }>(event);

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey);

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

  // TODO: fetch or create Stripe customer for this shop/user
  // For now, we can just create a new customer:
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    success_url: `${config.public.appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.public.appUrl}/billing/cancel`,
    metadata: {
      shop_id: body.shopId,
      plan_id: plan.id,
      stripe_price_id: plan.stripe_price_id,
    },
  });

  return { url: session.url };
});
