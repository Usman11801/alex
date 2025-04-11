import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from "@/config/fe/stripe";
import { loadStripe, Stripe } from "@stripe/stripe-js";
// import { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY } from "@/config/fe/stripe";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};
