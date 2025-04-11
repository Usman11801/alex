function getStripeKey(): string {
  const stripeKey = process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY_LIVE  : process.env.STRIPE_SECRET_KEY_TEST;

  if (stripeKey === undefined) {
    throw new Error("Missing STRIPE_SECRET_KEY_LIVE or STRIPE_SECRET_KEY_TEST in .env file");
  }

  return stripeKey
}

const STRIPE_SECRET_KEY = getStripeKey()

export { STRIPE_SECRET_KEY };
