import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "./constants";

export function validarEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

export function validarCep(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.length === 8;
}

export function validarSenhaForte(senha: string): boolean {
  const temMinimo8 = senha.length >= 8;
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /\d/.test(senha);
  const temEspecial = /[^A-Za-z0-9]/.test(senha);

  return temMinimo8 && temMaiuscula && temMinuscula && temNumero && temEspecial;
}

export function validarImagem(file: File): string | null {
  const tamanhoMaximo = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP.";
  }

  if (file.size > tamanhoMaximo) {
    return `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB}MB.`;
  }

  return null;
}
export function getPasswordStrength(senha: string) {
  const checks = {
    minLength: senha.length >= 8,
    upperLower: /[A-Z]/.test(senha) && /[a-z]/.test(senha),
    number: /\d/.test(senha),
    special: /[^A-Za-z0-9]/.test(senha),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let label = "Fraca";

  if (score === 2) label = "Média";
  if (score === 3) label = "Boa";
  if (score === 4) label = "Forte";

  return {
    checks,
    score,
    label,
  };
}