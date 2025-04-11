import { IChat, INewChat } from "@/types/chat";
import { LIMIT_TOKENS } from "@/utils/constants";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getDatabase, push, child, ref, update, get } from "firebase/database";

const DB_KEY = {
  users: "users",
  chats: "chats",
};

const TAG = {
  chats: "chats",
  chat: "chat",
  remainingTokens: "remainingTokens",
};

type Updates = { [key: string]: any };

export const DB_APIS_REDUCER_PATH = "db";

const dbApis = createApi({
  reducerPath: DB_APIS_REDUCER_PATH,
  tagTypes: Object.values(TAG),
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    createChat: build.mutation<
      { id: string },
      { userId: string; data: INewChat }
    >({
      async queryFn({ data, userId }) {
        try {
          const db = getDatabase();

          const { messages } = data;

          // Remove metadata since it can have invalid tokens
          const chatData: INewChat = {
            ...data,
            messages: messages.map((msg) => {
              if (msg.type === "user") {
                return {
                  type: msg.type,
                  text: msg.text,
                };
              }

              return {
                type: msg.type,
                text: msg.text,
                feedback: {
                  action: msg.feedback?.action || "",
                  reason: msg.feedback?.reason || "",
                },
                rating: msg.rating || 0,
              };
            }),
          };
          const newChatKey = push(
            child(ref(db), `${DB_KEY.users}/${userId}/${DB_KEY.chats}`)
          ).key;

          const updates: Updates = {};
          updates[`/${DB_KEY.users}/${userId}/${DB_KEY.chats}/${newChatKey}`] =
            chatData;

          await update(ref(db), updates);
          return { data: { id: newChatKey as string } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [TAG.chats, TAG.chat],
    }),
    updateChat: build.mutation<{ id: string }, { userId: string; data: IChat }>(
      {
        async queryFn({ data, userId }) {
          try {
            const db = getDatabase();

            const { messages, id, ...rest } = data;

            // Remove metadata since it can have invalid tokens
            const chatData: INewChat = {
              ...rest,
              messages: messages.map((msg) => {
                if (msg.type === "user") {
                  return {
                    type: msg.type,
                    text: msg.text,
                  };
                }

                return {
                  type: msg.type,
                  text: msg.text,
                  feedback: {
                    action: msg.feedback?.action || "",
                    reason: msg.feedback?.reason || "",
                  },
                  rating: msg.rating || 0,
                };
              }),
            };
            const updates: Updates = {};
            updates[`/${DB_KEY.users}/${userId}/${DB_KEY.chats}/${id}`] =
              chatData;

            await update(ref(db), updates);
            return { data: { id } };
          } catch (error) {
            return { error };
          }
        },
        invalidatesTags: [TAG.chat],
      }
    ),
    getChats: build.query<IChat[], { userId: string }>({
      async queryFn({ userId }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);

          const snapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/${DB_KEY.chats}`)
          );
          if (snapshot.exists()) {
            const values = snapshot.val();
            const data = Object.entries(values).map(([key, val]) => ({
              id: key,
              ...(val as any),
            })) as IChat[];
            
            data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return { data };
          } else {
            return { data: [] };
          }
        } catch (e) {
          return { error: JSON.stringify(e) };
        }
      },
      providesTags: [TAG.chats],
    }),
    getChat: build.query<IChat | null, { userId: string; chatId: string }>({
      async queryFn({ userId, chatId }) {
        if (!chatId) return { data: null };
        try {
          const db = getDatabase();
          const dbRef = ref(db);

          const snapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/${DB_KEY.chats}/${chatId}`)
          );
          if (snapshot.exists()) {
            const data = snapshot.val() as IChat;

            return { data: { ...data, id: chatId } };
          } else {
            throw new Error("No data available");
          }
        } catch (e) {
          return { error: JSON.stringify(e) };
        }
      },
      providesTags: [TAG.chat],
    }),

    deleteChat: build.mutation<
      { id: string },
      { userId: string; chatId: string }
    >({
      async queryFn({ userId, chatId }) {
        try {
          const db = getDatabase();

          const updates: Updates = {};
          updates[`/${DB_KEY.users}/${userId}/${DB_KEY.chats}/${chatId}`] =
            null;

          await update(ref(db), updates);
          return { data: { id: chatId } };
        } catch (error) {
          return { error };
        }
      },
    }),

    updateUserDepartment: build.mutation<
      { id: string },
      { userId: string; departmentName: string }
    >({
      async queryFn({ departmentName, userId }) {
        try {
          const db = getDatabase();

          const updates: Updates = {};
          updates[`/${DB_KEY.users}/${userId}/department`] = departmentName;

          await update(ref(db), updates);
          return { data: { id: userId } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [],
    }),

    updateUserSubscriptionPlan: build.mutation<
      { id: string },
      { userId: string; plan: string }
    >({
      async queryFn({ plan, userId }) {
        try {
          const db = getDatabase();

          const updates: Updates = {};
          updates[`/${DB_KEY.users}/${userId}/plan`] = plan;
          updates[`/${DB_KEY.users}/${userId}/remainingTokens`] = LIMIT_TOKENS.PAID;

          await update(ref(db), updates);
          return { data: { id: userId } };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [],
    }),

    getUserSubscriptionPlan: build.query<string, { userId: string }>({
      async queryFn({ userId }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);

          const snapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/plan`)
          );
          if (snapshot.exists()) {
            const data = snapshot.val() as string;

            return { data };
          } else {
            throw new Error("No data available");
          }
        } catch (e) {
          return { error: JSON.stringify(e) };
        }
      },
    }),
    updateGeneralFeedback: build.mutation<
      string,
      { userId: string; feedback: string }
    >({
      async queryFn({ userId, feedback }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);
          //get current general feedback
          const snapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/generalFeedback`)
          );
          const updates: Updates = {};
          if (snapshot.exists()) {
            const currentFeedback = snapshot.val() as string[];
            //append new feedback
            const newFeedbacks = [...currentFeedback, feedback];
            //update db
            updates[`/${DB_KEY.users}/${userId}/generalFeedback`] =
              newFeedbacks;

            await update(ref(db), updates);
            return { data: userId };
          }

          updates[`/${DB_KEY.users}/${userId}/generalFeedback`] = [feedback];

          await update(ref(db), updates);
          return { data: userId };
        } catch (error) {
          return { error };
        }
      },
    }),

    setDefaultRemainingTokens: build.mutation<any, { userId: string }>({
      async queryFn({ userId }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);
          const updates: Updates = {};
          updates[`/${DB_KEY.users}/${userId}/remainingTokens`] =
            LIMIT_TOKENS.FREE;

          await update(ref(db), updates);
          return { data: userId };
        } catch (error) {
          return { error };
        }
      },
    }),

    setIsCompletedSignup: build.mutation<any, { userId: string }>({
      async queryFn({ userId }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);
          const updates: Updates = {};
          updates[`/${DB_KEY.users}/${userId}/isCompletedSignup`] = true;

          await update(ref(db), updates);
          return { data: userId };
        } catch (error) {
          return { error };
        }
      },
    }),

    getIsCompletedSignup: build.mutation<boolean, { userId: string }>({
      async queryFn({ userId }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);

          const snapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/isCompletedSignup`)
          );
          if (snapshot.exists()) {
            const data = snapshot.val() as boolean;

            return { data };
          } else {
            return { data: false };
          }
        } catch (e) {
          return { error: JSON.stringify(e) };
        }
      },
    }),

    getRemainingTokens: build.query<number, { userId: string }>({
      async queryFn({ userId }) {
        try {
          const db = getDatabase();
          const dbRef = ref(db);

          const planSnapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/plan`)
          );
          if (planSnapshot.exists()) {
            const plan = planSnapshot.val() as string;
            if (plan === 'paid') {
              return { data: LIMIT_TOKENS.PAID };
            }
          }

          const snapshot = await get(
            child(dbRef, `${DB_KEY.users}/${userId}/remainingTokens`)
          );
          if (snapshot.exists()) {
            const data = snapshot.val() as number;

            return { data };
          } else {
            throw new Error("No data available");
          }
        } catch (e) {
          return { error: JSON.stringify(e) };
        }
      },
      providesTags: [TAG.remainingTokens],
    }),

    setRemainingTokens: build.mutation<any, { userId: string; tokens: number }>(
      {
        async queryFn({ userId, tokens }) {
          try {
            const db = getDatabase();
            const dbRef = ref(db);
            const updates: Updates = {};
            const newTokens = tokens < 0 ? 0 : tokens;
            updates[`/${DB_KEY.users}/${userId}/remainingTokens`] = newTokens;

            await update(ref(db), updates);
            return { data: userId };
          } catch (error) {
            return { error };
          }
        },
        invalidatesTags: [TAG.remainingTokens],
      }
    ),
  }),
});

export const {
  useCreateChatMutation,
  useUpdateChatMutation,
  useGetChatsQuery,
  useGetChatQuery,
  useUpdateUserDepartmentMutation,
  useUpdateUserSubscriptionPlanMutation,
  useGetUserSubscriptionPlanQuery,
  useUpdateGeneralFeedbackMutation,
  useDeleteChatMutation,
  useSetDefaultRemainingTokensMutation,
  useSetIsCompletedSignupMutation,
  useGetIsCompletedSignupMutation,
  useGetRemainingTokensQuery,
  useSetRemainingTokensMutation,
} = dbApis;

export default dbApis;
