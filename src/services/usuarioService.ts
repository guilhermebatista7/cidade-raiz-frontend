import { apiFetch } from "./api";

export async function listarRoles(){
    return await apiFetch('/usuario/roles', {
        method: "GET",
    })
}
