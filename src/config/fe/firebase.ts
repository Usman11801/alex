
if (!process.env.NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY in .env file");
}

const FIREBASE_CONFIG_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG_API_KEY ?? "";

export { FIREBASE_CONFIG_API_KEY };
