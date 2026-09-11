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

const ROLES_GESTAO: Role[] = [
  "FUNCIONARIO",
  "ADMIN_LOCAL",
  "GLOBAL"
];

export function podeAcessarGestao(
  usuario?: Usuario | null
): boolean {
  return !!usuario && ROLES_GESTAO.includes(usuario.role);
}
