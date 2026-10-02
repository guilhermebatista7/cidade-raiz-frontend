import type { StatusRequisicao } from "../types";
import { apiFetch } from "./api";

export async function cadastrarRequisicao(formData: FormData) {
  return await apiFetch("/requisicao", {
    method: "POST",
    body: formData,
  })
}

export async function atualizarRequisicao(id: string, formData: FormData) {
  return await apiFetch(`/requisicao/${id}`, {
    method: "PUT",
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

export async function listarMinhasRequisicoes(){
  return await apiFetch('/requisicao/usuario', {
    method: "GET"
  })
}

export async function recusarRequisicao(id: string, observacaoStatus: string) {
  return await apiFetch(`/requisicao/recusar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      observacaoStatus
    }),
  })
}

export async function agendarPlantio(id:string, dataInicial: Date, dataFinal: Date){
  return await apiFetch(`/requisicao/agendar/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dataInicial,
      dataFinal
    })
  })
}

export async function alterarStatus(id:string, status:StatusRequisicao){
  return await apiFetch(`/requisicao/alterarStatus/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status
    })
  })
}