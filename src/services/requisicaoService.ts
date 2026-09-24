import { apiFetch } from "./api";

export async function cadastrarRequisicao(formData: FormData) {
  return await apiFetch("/solicitacao", {
    method: "POST",
    body: formData,
  })
}