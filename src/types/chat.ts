import { Document } from "langchain/dist/document";

export type IMessageType = "bot" | "user" | "bot-temp";
export interface IMessage {
  type: IMessageType;
  text: string;
  feedback?: IFeedbackType;
  rating?: number;
  sourceDocs?: Document[];
}

export type IFeedbackType = {
  action?: string;
  reason?: string;
};

export type IHistory = [string, string][];

export interface IChat {
  id: string;
  userId: string;
  name: string;
  messages: IMessage[];
  history: IHistory;
  createdAt: string;
}

export type INewChat = Omit<IChat, "id">;

export interface IMessageFeedback {
  id: string;
}

export interface IChatResponse {
  text: string;
  sourceDocuments: Document[];
  questionTokens: number;
  answerTokens: number;
}

export interface ICreateSessionResponse {
  sessionId: string;
}
