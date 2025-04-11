import { IHistory } from "@/types/chat";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IChatResponse } from "@/types/chat";

const chatApis = createApi({
  reducerPath: "chatApis",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/chat",
  }),
  tagTypes: [],
  endpoints: (build) => ({
    sendChatMessage: build.mutation<
      IChatResponse,
      {
        question: string;
        history: IHistory;
        amendment: string | null;
        customResponse?: any;
      }
    >({
      query: ({ question, history, amendment, customResponse }) => {
        return {
          url: "/",
          method: "POST",
          body: {
            question,
            history,
            amendment,
            customResponse,
          },
        };
      },
    }),
  }),
});

export const { useSendChatMessageMutation } = chatApis;

export default chatApis;
