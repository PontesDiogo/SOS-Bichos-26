import { supabase } from "../lib/supabaseClient";

export async function uploadFotoDenuncia(file: File, userId: string): Promise<string> {
  const extensao = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${extensao}`;

  const { error: uploadError } = await supabase.storage
    .from("denuncias")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error("Erro ao enviar foto da denúncia:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from("denuncias").getPublicUrl(fileName);

  return data.publicUrl;
}
export async function uploadFotoPerfil(file: File, userId: string): Promise<string> {
  const extensao = file.name.split(".").pop();
  const fileName = `${userId}/avatar-${Date.now()}.${extensao}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return data.publicUrl;
}