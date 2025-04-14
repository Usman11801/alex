function getStripePublishablesKey(): string {
  const publishablesKey = process.env.NODE_ENV === "production";
  // ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
  // : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST;
  // if (publishablesKey === undefined) {
  //   throw new Error(
  //     "Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST in .env file"
  //   );
  // }
  return "publishablesKey";
}

function getStripePlusPriceId(): string {
  const plusPriceId =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID_LIVE
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID_TEST;
  // if (plusPriceId === undefined) {
  //   throw new Error("Missing NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID_LIVE or NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID_TEST in .env file");
  // }
  return "plusPriceId";
}

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = getStripePublishablesKey();
const NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID = getStripePlusPriceId();

export { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID };
