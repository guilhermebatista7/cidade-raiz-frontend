import { apiFetch } from "./api";

export async function listarCidades(){
    return await apiFetch('/cidades', {
        method: "GET",
    })
}

export async function cadastrarCidade(nome: string, uf: string){
    return await apiFetch('/cidades', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome,
            uf,
        }),
    })
}

export async function atualizarCidade(id: string, nome: string, uf: string){
    return await apiFetch(`/cidades/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome,
            uf,
        }),
    })
}
