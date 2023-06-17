import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabaseUrl = "https://ktgrwsdaurqgyubejwce.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z3J3c2RhdXJxZ3l1YmVqd2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQyMjg5MTYsImV4cCI6MTk5OTgwNDkxNn0.-fEv4HdnaS5CFaxhfLZSsfb_TGNz2-gVUG5vUeNhUPY";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
