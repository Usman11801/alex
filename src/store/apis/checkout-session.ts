import { ICreateSessionResponse } from "@/types/chat";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const checkoutSessionApis = createApi({
  reducerPath: "checkoutSessionApis",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/create-checkout-session",
  }),
  tagTypes: [],
  endpoints: (build) => ({
    createCheckoutSession: build.mutation<
      ICreateSessionResponse,
      { priceId: string }
    >({
      query: ({priceId}) => {
        return {
          url: "/",
          method: "POST",
          body: {
            priceId,
          },
        };
      },
    }),
  }),
});

export const { useCreateCheckoutSessionMutation } = checkoutSessionApis;

export default checkoutSessionApis;
