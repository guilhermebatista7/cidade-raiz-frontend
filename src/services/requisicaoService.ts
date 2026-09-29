import { apiFetch } from "./api";

export async function cadastrarRequisicao(formData: FormData) {
  return await apiFetch("/requisicao", {
    method: "POST",
    body: formData,
  })
}

export async function listarRequisicoes() {
  return await apiFetch("/requisicao", {
    method: "GET"
  })
}

export async function listarRequisicoesCidade(id: string) {
  return await apiFetch(`/requisicao/cidade/${id}`, {
    method: "GET"
  })
}

export async function recusarRequisicao(id: string, observacaoStatus: string) {
  return await apiFetch(`/requisicao/recusar/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      observacaoStatus
    }),
  })
}