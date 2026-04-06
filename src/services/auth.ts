import { supabase } from "../lib/supabaseClient";

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    return { data, error };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return { data, error };
}

export async function getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
}