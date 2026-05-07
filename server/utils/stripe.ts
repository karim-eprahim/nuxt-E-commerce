import Stripe from "stripe"

export const stripe = () => {
  const config = useRuntimeConfig()

  return new Stripe(config.stripeSecret, {
    apiVersion: "2026-01-28.clover",
  })
}