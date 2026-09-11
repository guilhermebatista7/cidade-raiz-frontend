import { useState, useMemo } from "react";
import './AbaSolicitacao.css';

// 1. Tipagem dos dados da aba
interface Solicitacao {
    id: string;
    cidadaoNome: string;
    arvoreNome: string;
    tipo: string;
    bairro: string;
    status: "SOLICITADO" | "APROVADO" | "RECUSADO" | "CONCLUIDO" | "AGUARDANDO_RETIRADA" | "AGENDADO_PLANTIO";
}

export function AbaSolicitacoes() {
    // Dados vindos da API (ou lista inicial)
    const [solicitacoes] = useState<Solicitacao[]>([
        { id: "001", cidadaoNome: "Maria Silva", arvoreNome: "Ipê Amarelo", tipo:"Agendar Plantio" , bairro: "Centro", status: "SOLICITADO" },
        { id: "002", cidadaoNome: "João Souza", arvoreNome: "Jacarandá", tipo:"Retirar no Local", bairro: "Jardins", status: "APROVADO" },
        { id: "003", cidadaoNome: "João ", arvoreNome: "Jacarandá", tipo:"Agendar Plantio", bairro: "Jardins", status: "RECUSADO" },
        { id: "004", cidadaoNome: " Souza", arvoreNome: "Jacarandá", tipo:"Retirar no Local", bairro: "Jardins", status: "CONCLUIDO" },
        { id: "005", cidadaoNome: " Souza", arvoreNome: "Jacarandá", tipo:"Retirar no Local", bairro: "Jardins", status: "AGUARDANDO_RETIRADA" },
        { id: "006", cidadaoNome: " Souza", arvoreNome: "Jacarandá", tipo:"Retirar no Local", bairro: "Jardins", status: "AGENDADO_PLANTIO" },

        // ...
    ]);

    // 2. ESTADOS DOS FILTROS
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("TODOS");

    // 3. LÓGICA DE FILTRAGEM REATIVA COM useMemo
    const solicitacoesFiltradas = useMemo(() => {
        return solicitacoes.filter((item) => {
            // Regra 1: Filtro de texto (busca por nome do cidadão, árvore ou bairro)
            const termo = busca.toLowerCase();
            const bateTexto =
                item.cidadaoNome.toLowerCase().includes(termo) ||
                item.arvoreNome.toLowerCase().includes(termo) ||
                item.bairro.toLowerCase().includes(termo);

            // Regra 2: Filtro por Status
            const bateStatus = statusFiltro === "TODOS" || item.status === statusFiltro;

            // O item só passa se atender a todos os filtros ativos
            return bateTexto && bateStatus;
        });
    }, [solicitacoes, busca, statusFiltro]);

    return (
        <div className="abaSolicitacaoConteudo">
            {/* BARRA VISUAL DE FILTROS */}
            <div className="barraFiltros">
                {/* Input de Busca Textual */}
                <input
                    type="text"
                    placeholder="Buscar por cidadão, árvore ou bairro..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                {/* Select de Status */}
                <select
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                >
                    <option value="TODOS">Todos os Status</option>
                    <option value="SOLICITADO">Solicitados</option>
                    <option value="APROVADO">Aprovados</option>
                    <option value="RECUSADO">Recusados</option>
                    <option value="CONCLUIDO">Concluídos</option>
                    <option value="AGENDADO_PLANTIO">Plantio Agendado</option>
                    <option value="AGUARDANDO_RETIRADA">Aguardando Retirada</option>
                </select>

                {/* Botão para limpar filtros (caso algum esteja ativo) */}
                {(busca || statusFiltro !== "TODOS") && (
                    <button
                        type="button"
                        className="btnLimparFiltros"
                        onClick={() => {
                            setBusca("");
                            setStatusFiltro("TODOS");
                        }}
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>

            {/* RENDERIZAÇÃO DA TABELA FILTRADA */}
            <div className="listaResultado">
                <table className="table tableSolicitacao">
                    <thead>
                        <tr>
                            <th scope="col">Nome cidadão</th>
                            <th scope="col">Árvore</th>
                            <th scope="col">Bairro</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Status</th>
                            <th scope="col" className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitacoesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="mensagemVazio">
                                    Nenhum resultado encontrado com os filtros atuais.
                                </td>
                            </tr>
                        ) : (
                            solicitacoesFiltradas.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.cidadaoNome}</strong></td>
                                    <td>{item.arvoreNome}</td>
                                    <td>{item.bairro}</td>
                                    <td><span className="tipoTag">{item.tipo}</span></td>
                                    <td><span className={`statusTag ${item.status.toLowerCase()}`}>{item.status}</span></td>
                                    <td className="text-center">
                                        <button type="button" className="btnVerificar">
                                            Verificar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}