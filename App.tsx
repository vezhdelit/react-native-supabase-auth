import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Account from "./components/Account";
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaView style={styles.wrap}>
      <StatusBar barStyle="light-content" backgroundColor="#1F1F1F" />
      {session && session.user ? (
        <Account key={session.user.id} session={session} />
      ) : (
        <Auth />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    justifyContent: "center",
  },
});
