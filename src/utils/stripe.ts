import { STRIPE_SECRET_KEY } from "@/config/be/stripe";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export { stripe };