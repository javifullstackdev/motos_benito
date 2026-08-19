const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function apiFetch(path: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al hacer la petición");
    }

    return data;
}

export default apiFetch;