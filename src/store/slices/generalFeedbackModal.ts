import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import { useSelector } from "react-redux";

export interface GeneralFeedbackModalState {
  isOpen: boolean;
}

const initialState: GeneralFeedbackModalState = {
  isOpen: false,
};

export const generalFeedbackModal = createSlice({
  name: "generalFeedbackModal",
  initialState,
  reducers: {
    openGeneralFeedbackModal: (state) => {
      state.isOpen = true;
    },
    closeGeneralFeedbackModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const generalFeedbackModalActions = generalFeedbackModal.actions;
export const generalFeedbackModalReducer = generalFeedbackModal.reducer;
export const useIsGeneralFeedbackModalOpen = () =>
  useSelector((state: RootState) => state.generalFeedbackModal.isOpen);
