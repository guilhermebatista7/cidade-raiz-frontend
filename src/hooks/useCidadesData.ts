import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../services/queryKeys";
import { listarCidades, listarCidadesAtivas } from "../services/cidadeService";

export function useCidade() {
    return useQuery({
        queryKey: queryKeys.cidades.todas,
        queryFn: () => listarCidades(),
        staleTime: 1000 * 60 * 30,
    });
}

export function useCidadesAtivas(){
    return useQuery({
        queryKey: queryKeys.cidades.ativas,
        queryFn: () => listarCidadesAtivas(),
        staleTime: 1000 * 60 * 30,
    })
}