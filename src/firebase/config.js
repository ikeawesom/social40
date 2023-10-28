// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const PROD = false;

const CONFIG_DEV = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const CONFIG_PROD = {
  apiKey: process.env.NEXT_PUBLIC_PROD_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_PROD_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROD_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_PROD_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_PROD_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_PROD_MEASUREMENT_ID,
};

// Initialize Firebase
let config = CONFIG_DEV;
if (PROD) config = CONFIG_PROD;

export const FIREBASE_APP = initializeApp(config);
console.log("Initializing Primary Firebase App");
export const SECONDARY_FIREBASE_APP = initializeApp(config, "SECONDARY");
console.log("Initializing Secondary Firebase App");
