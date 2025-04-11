import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import { useSelector } from "react-redux";

export interface SubscriptionModalState {
  isOpen: boolean;
}

const initialState: SubscriptionModalState = {
  isOpen: false,
};

export const subscriptionModalSlice = createSlice({
  name: "subscriptionModal",
  initialState,
  reducers: {
    openSubscriptionModal: (state) => {
      state.isOpen = true;
    },
    closeSubscriptionModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const subscriptionModalActions = subscriptionModalSlice.actions;
export const subscriptionModalReducer = subscriptionModalSlice.reducer;
export const useIsSubscriptionModalOpen = () =>
  useSelector((state: RootState) => state.subscriptionModal.isOpen);
