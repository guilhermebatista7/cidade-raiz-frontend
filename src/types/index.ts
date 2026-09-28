// src/types/index.ts

export type Role = 'CIDADAO' | 'FUNCIONARIO' | 'ADMIN_LOCAL' | 'GLOBAL';

export type StatusRequisicao = 
  | 'SOLICITADO' 
  | 'APROVADO' 
  | 'RECUSADO' 
  | 'AGUARDANDO_RETIRADA' 
  | 'AGENDADO_PLANTIO' 
  | 'CONCLUIDO';

export type TipoAtendimento = 'RETIRADA_LOCAL' | 'PLANTIO_AGENDADO';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  role: Role;
  cidadeId?: string | null;
  cidade?: Cidade;
  criadoEm: string; // No JSON da API, datas costumam vir como string ISO
  atualizadoEm: string;
  ativo: boolean;
}

export interface Arvore {
  id: string;
  cidadeId?: string | null;
  cidade?: Cidade;
  nomePopular: string;
  descricao?: string | null;
  imagemUrl?: string | null;
  quantidade: number;
  ativa: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Requisicao {
  id: string;
  criadoPorId: string;
  cidadao?: Usuario;
  cidadeId: string;
  cidade?: Cidade;
  arvoreId: string;
  arvore?: Arvore;
  status: StatusRequisicao;
  observacaoStatus?: string; //OBS caso req seja negada 
  tipoAtendimento: TipoAtendimento;
  rua: string;
  numero: string;
  bairro: string;
  cidadeEndereco: string;
  cep: string;
  estado: string;
  pontoReferencia?: string | null;
  fotoLocalUrl?: string | null;
  comprovanteResidenciaUrl?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Cidade {
  id: string;
  nome: string;
  uf: string;
  usuarios?: Usuario[];       // Opcional, caso a rota traga os usuários
  requisicoes?: Requisicao[]; // Opcional, caso a rota traga as requisições
  arvores?: Arvore[];         // Opcional, caso a rota traga as árvores
  criadoEm: string;
  atualizadoEm: string;
  ativa: boolean;
}