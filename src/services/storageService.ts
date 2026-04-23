import { supabase } from "../lib/supabaseClient";

export async function uploadFotoDenuncia(file: File, userId: string): Promise<string> {
  const extensao = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${extensao}`;

  const { error: uploadError } = await supabase.storage
    .from("denuncias")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("denuncias").getPublicUrl(fileName);

  return data.publicUrl;
}