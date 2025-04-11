import { NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID } from "@/config/fe/stripe";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
};

export const LIMIT_TOKENS = {
  FREE: 5000,
  BASIC: 20000,
  PLUS: 40000,
  PAID: -1,
};

export const PLAN_IDS = {
  PLUS: NEXT_PUBLIC_STRIPE_PRICE_PLUS_ID 
};

export const USER_TIERS = {
  PAID: "paid",
  FREE: "free",
};

export const TIER_BAGDES = {
  PAID: "Pro",
  FREE: "Free",
};

export const codeLanguageSubset = [
  "python",
  "javascript",
  "java",
  "go",
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "diff",
  "graphql",
  "json",
  "kotlin",
  "less",
  "lua",
  "makefile",
  "markdown",
  "objectivec",
  "perl",
  "php",
  "php-template",
  "plaintext",
  "python-repl",
  "r",
  "ruby",
  "rust",
  "scss",
  "shell",
  "sql",
  "swift",
  "typescript",
  "vbnet",
  "wasm",
  "xml",
  "yaml",
];
