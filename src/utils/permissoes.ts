export type Role =
  | "CIDADAO"
  | "FUNCIONARIO"
  | "ADMIN_LOCAL"
  | "GLOBAL";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: Role;
  cidadeId?: string;
}

export function podeAcessarGestao(usuario?: Usuario | null) {
  return !!usuario && usuario.role !== "CIDADAO";
}
