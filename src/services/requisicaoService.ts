import { apiFetch } from "./api";

export async function cadastrarRequisicao(formData: FormData) {
  return await apiFetch("/requisicao", {
    method: "POST",
    body: formData,
  })
}

export async function listarRequisicoes(){
  return await apiFetch("/requisicao", {
    method: "GET"
  })
}

export async function listarRequisicoesCidade(id: string){
  return await apiFetch(`/requisicao/cidade/${id}`, {
    method: "GET"
  })
}