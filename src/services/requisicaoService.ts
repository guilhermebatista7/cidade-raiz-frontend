import { apiFetch } from "./api";

export async function cadastrarRequisicao(formData: FormData) {
  return await apiFetch("/requisicao", {
    method: "POST",
    body: formData,
  })
}