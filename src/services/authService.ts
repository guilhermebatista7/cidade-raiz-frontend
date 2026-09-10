import { apiFetch } from "./api";

export async function cadastrar(
  nome:  string,
  email: string,
  senha: string
) {

  return await apiFetch(
    "/auth/register",
    {
      method: "POST",

      body: JSON.stringify({
        nome,
        email,
        senha
      })
    }
  );
}

export async function login(email: string, senha: string) {
  return await apiFetch(
    "/auth/login",
    {
      method: 'POST',

      body: JSON.stringify({
        email,
        senha
      })
    }
  )
}