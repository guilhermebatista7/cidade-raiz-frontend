import { finalizarLoading, iniciarLoading } from "./loadingService";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(
    endpoint: string,
    options?: RequestInit
) {
    const isFormData = options?.body instanceof FormData;

    const headers: Record<string, string> = {
        ...((options?.headers as Record<string, string>) || {})
    };

    if (!isFormData && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    iniciarLoading();

    try {
        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                credentials: "include",
                headers,
            }
        );

        const text = await response.text();

        const data = text
            ? JSON.parse(text)
            : null;

        if (!response.ok) {
            throw new Error(
                data?.message || "Erro na requisição"
            );
        }

        return data;

    } finally {
        finalizarLoading();
    }
}
