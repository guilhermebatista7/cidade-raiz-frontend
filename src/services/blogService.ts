import { apiFetch } from "./api";

export async function listarPublicacoes(){
    return await apiFetch('/cidades', {
        method: "GET",
    })
}

export async function publicar(idRequisicao: string, titulo: string, descricao: string){
    return await apiFetch("/blog", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idRequisicao,
            titulo,
            descricao,
        }),
    })
}

export async function verificarPublicacao(idRequisicao: string){
    return await apiFetch(`/blog/${idRequisicao}`, {
        method: 'GET',
    })
}