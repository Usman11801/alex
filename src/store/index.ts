import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import chatApis from "@/store/apis/chat";
import dbApis from "@/store/apis/db";
import checkoutSessionApis from "@/store/apis/checkout-session";
import { userReducer } from "@/store/slices/user";
import { subscriptionModalReducer } from "@/store/slices/subscriptionPlanModal";
import { generalFeedbackModalReducer } from "@/store/slices/generalFeedbackModal";

const reducer = combineReducers({
  [checkoutSessionApis.reducerPath]: checkoutSessionApis.reducer,
  [chatApis.reducerPath]: chatApis.reducer,
  [dbApis.reducerPath]: dbApis.reducer,
  user: userReducer,
  subscriptionModal: subscriptionModalReducer,
  generalFeedbackModal: generalFeedbackModalReducer,
});

const makeStore = () =>
  configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([
        chatApis.middleware,
        dbApis.middleware,
        checkoutSessionApis.middleware,
      ]),
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);
export type RootState = ReturnType<typeof reducer>;
