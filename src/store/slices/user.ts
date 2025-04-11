import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User as FirebaseUser } from "firebase/auth";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { IChat } from "@/types/chat";

export interface UserState {
  currentUser: FirebaseUser | null;
  currentChat: IChat | null;
}

const initialState: UserState = {
  currentUser: null,
  currentChat: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      state.currentUser = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<IChat | null>) => {
      state.currentChat = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
export const useCurrentUserSelector = () =>
  useSelector((state: RootState) => state.user.currentUser);
export const useCurrentChatSelector = () =>
  useSelector((state: RootState) => state.user.currentChat);
