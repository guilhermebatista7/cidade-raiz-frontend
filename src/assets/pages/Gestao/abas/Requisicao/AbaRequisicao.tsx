import { useState, useMemo, useEffect } from "react";
import './AbaRequisicao.css';
import { obterUsuarioLogado } from "../../../../../services/authService";
import type { Cidade, Usuario } from "../../../../../types";
import { listarRequisicoes, listarRequisicoesCidade } from "../../../../../services/requisicaoService";
import { listarCidades } from "../../../../../services/cidadeService";

// 1. Tipagem dos dados da aba
interface Requisicao {
    id: string;
    cidadaoNome: string;
    arvoreNome: string;
    tipo: string;
    bairro: string;
    status: "SOLICITADO" | "APROVADO" | "RECUSADO" | "CONCLUIDO" | "AGUARDANDO_RETIRADA" | "AGENDADO_PLANTIO";
}

export function AbaRequisicoes() {
    // Dados vindos da API (ou lista inicial)


    // 2. ESTADOS DOS FILTROS
    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("TODOS");
    const [cidadeFiltro, setCidadeFiltro] = useState("");


    const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
    const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
    const [cidades, setCidades] = useState<Cidade[]>([]);

    // 3. LÓGICA DE FILTRAGEM REATIVA COM useMemo
    const requisicoesFiltradas = useMemo(() => {
        return requisicoes.filter((item) => {
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
    }, [requisicoes, busca, statusFiltro]);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const dadosLogado = await obterUsuarioLogado();
            setUsuarioLogado(dadosLogado.usuario);

            if (dadosLogado.usuario.role !== 'GLOBAL') {
                const dadosReq = await listarRequisicoes();
                setRequisicoes(dadosReq);
                console.log(dadosReq);
                return;
            }

            // Se for usuário GLOBAL busca todas as cidades para fazer filtro no select
            const dadosCidades = await listarCidades();
            setCidades(dadosCidades);


            if (dadosCidades.length > 0) {

                const primeiraCidadeId = dadosCidades[0].id;
                setCidadeFiltro(primeiraCidadeId);

                const dadosReq = await listarRequisicoesCidade(primeiraCidadeId);
                setRequisicoes(dadosReq);
                console.log(dadosReq);
            }

        } catch (error) {
            console.log("Erro ao carregar dados: ", error);
        }
    }

    const buscarReqCidade = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cidadeId = e.target.value;

        setCidadeFiltro(cidadeId);

        const dadosReq = await listarRequisicoesCidade(cidadeId);
        setRequisicoes([dadosReq]);
    }


    return (
        <div className="abaRequisicaoConteudo">
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

                {usuarioLogado?.role === 'GLOBAL' && (
                    <select
                        value={cidadeFiltro}
                        onChange={buscarReqCidade}
                    >
                        {cidades.map((item) => (
                            <option key={item.id} value={item.id}>{item.nome}</option>
                        ))}
                    </select>
                )}

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
                <table className="table tableRequisicao">
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
                        {requisicoesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="mensagemVazio">
                                    Nenhum resultado encontrado com os filtros atuais.
                                </td>
                            </tr>
                        ) : (
                            requisicoesFiltradas.map((item) => (
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