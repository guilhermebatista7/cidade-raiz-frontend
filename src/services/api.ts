const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
    endpoint: string,
    options?: RequestInit
) {
    // 1. Verifica se o corpo é um FormData
    const isFormData = options?.body instanceof FormData;

    // 2. Monta os headers dinamicamente
    const headers: Record<string, string> = {
        ...((options?.headers as Record<string, string>) || {})
    };

    // 3. SÓ injeta o application/json se NÃO for FormData
    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            credentials: "include", // ESSENCIAL: envia e recebe cookies httpOnly
            headers,
        }
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(
            data?.message || "Erro na requisição"
        );
    }

    return data;
}