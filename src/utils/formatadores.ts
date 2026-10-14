
export const formatarCep = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    return numeros.replace(/^(\d{5})(\d)/, "$1-$2");
};

export const formatarTelefone = (valor: string): string => {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 10) {
        return numeros
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
};
