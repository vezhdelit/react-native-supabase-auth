import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://buqbgrwxhxpuvnsoertr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cWJncnd4aHhwdXZuc29lcnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk0NjA1ODcsImV4cCI6MjAxNTAzNjU4N30.9wmPqz0vlyG-QlpwLUNM3GejfWUCA2F9tMjkGp3-EbE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
