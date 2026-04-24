import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import type { UserRole } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoadingAuth(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoadingAuth(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const nome =
    user?.user_metadata?.nome ||
    user?.email?.split("@")[0] ||
    "Usuário";

  const role = (user?.user_metadata?.role || "user") as UserRole;

  const isAdmin = role === "admin";

  async function logout() {
    await supabase.auth.signOut();
  }

  return {
    user,
    nome,
    role,
    isAdmin,
    loadingAuth,
    logout,
  };
}