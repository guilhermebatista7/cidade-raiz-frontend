// src/assets/components/RotaProtegida/RotaProtegida.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { podeAcessarGestao } from "../../../utils/permissoes";

interface RotaProtegidaProps {
  children: ReactNode;
}

export function RotaProtegida({ children }: RotaProtegidaProps) {
  const { usuario, carregando } = useAuth();

  // 1. Enquanto valida o cookie com o backend, não redireciona
  if (carregando) {
    return (
      <div className="paginaSkeletonContainer">
        <div className="skeletonBox paginaSkeletonHeader" />
        <div className="skeletonBox paginaSkeletonAbas" />
        <div className="skeletonBox paginaSkeletonConteudo" />
      </div>
    );
  }

  // 2. Não está autenticado -> vai para o Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 3. Usuário logado mas com role CIDADAO -> vai para a Home
  if (!podeAcessarGestao(usuario)) {
    return <Navigate to="/plantar" replace />;
  }

  // 4. Usuário autorizado (FUNCIONARIO, ADMIN_LOCAL ou GLOBAL)
  return <>{children}</>;
}