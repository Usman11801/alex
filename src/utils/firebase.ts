import { initializeApp } from "firebase/app";
import { getAuth as fbGetAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import type { FirebaseOptions } from "firebase/app";
import { FIREBASE_CONFIG_API_KEY } from "@/config/fe/firebase";

const firebaseConfig: FirebaseOptions = {
  apiKey: FIREBASE_CONFIG_API_KEY,

  authDomain: "gpt-chatbot-edf1c.firebaseapp.com",
  projectId: "gpt-chatbot-edf1c",
  storageBucket: "gpt-chatbot-edf1c.appspot.com",
  messagingSenderId: "506864792191",
  appId: "1:506864792191:web:13253e5921c06e52dbc54a",
  measurementId: "G-99HD5W0PDS",
  databaseURL: "https://gpt-chatbot-edf1c-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);

export const getApp = () => app;
export const getAuth = () => fbGetAuth(app);
export const fbDatabase = () => getDatabase(app);
