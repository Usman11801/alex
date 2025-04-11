import type { NextApiRequest, NextApiResponse } from "next";

import { getURL } from "@/utils/helpers";
import { stripe } from "@/utils/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { priceId } = req.body as {
    priceId: string;
  };

  try {
    let session;
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${getURL()}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getURL()}/`,
    });

    if (session) {
      res.status(200).json({
        sessionId: session.id,
      });
    } else {
      res.status(500).json({
        error: { statusCode: 500, message: "Session is not defined" },
      });
    }
  } catch (error: any) {
    console.error({ error });
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
