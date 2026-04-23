import type { UserRole } from "./auth";

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}