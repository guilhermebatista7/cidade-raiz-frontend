import { useState, useMemo, useEffect } from "react";
import './AbaConfig.css';
import { ativarCidade, atualizarCidade, cadastrarCidade, desativarCidade, listarCidades } from "../../../../../services/cidadeService";
import { estados } from "../../../../dataInfo/estados";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ModalForm from "../../../../components/ModalForm/ModalForm";

export function AbaConfig() {

    // 1. ESTADOS DE DADOS E CONTROLE DO MODAL
    const [cidades, setCidades] = useState<any[]>([]);
    const [modalAberto, setModalAberto] = useState(false);

    // Armazena o ID da cidade que está sendo editada (null = modo Adicionar)
    const [cidadeEmEdicaoId, setCidadeEmEdicaoId] = useState<string | null>(null);

    // Campos do formulário
    const [nome, setNome] = useState("");
    const [uf, setUf] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const dados = await listarCidades();
            setCidades(dados);
        } catch (error) {
            console.log("Erro ao carregar árvores");
        }
    }

    // Efeitos para controle do modal (mesmo padrão do seu código)
    useEffect(() => {
        document.body.classList.toggle("modalAberto", modalAberto);
        return () => document.body.classList.remove("modalAberto");
    }, [modalAberto]);

    useEffect(() => {
        if (!modalAberto) return;
        const fechar = (e: KeyboardEvent) => e.key === "Escape" && fecharModal();
        document.addEventListener("keydown", fechar);
        return () => document.removeEventListener("keydown", fechar);
    }, [modalAberto]);

    // Função auxiliar para abrir o modal no modo Adicionar
    const abrirModalAdicionar = () => {
        setCidadeEmEdicaoId(null);
        setNome("");
        setUf("");
        setModalAberto(true);
    };

    // Função auxiliar para abrir o modal no modo Editar (passando o ID)
    const abrirModalEditar = (id: string) => {
        const cidadeAlvo = cidades.find(item => item.id === id);
        if (!cidadeAlvo) return;

        setCidadeEmEdicaoId(id);
        setNome(cidadeAlvo.nome || "");
        setUf(cidadeAlvo.uf);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setCidadeEmEdicaoId(null);
    };

    // 2. ESTADOS DOS FILTROS
    const [busca, setBusca] = useState("");

    // 3. LÓGICA DE FILTRAGEM REATIVA COM useMemo
    const cidadesFiltradas = useMemo(() => {
        return cidades.filter((item) => {
            // Regra 1: Filtro de texto (busca por nome do cidadão, árvore ou bairro)
            const termo = busca.toLowerCase();
            const bateTexto =
                item.nome.toLowerCase().includes(termo) ||
                item.uf.toLowerCase().includes(termo);

            return bateTexto
        });
    }, [cidades, busca]);

    console.log(cidades);

    // Manipulador unificado de salvamento (Adição ou Edição)
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !uf) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {

            if (cidadeEmEdicaoId !== null) {
                // MODO EDIÇÃO
                await atualizarCidade(cidadeEmEdicaoId, nome, uf);
                alert("Cidade atualizada com sucesso!");
            } else {
                // MODO CRIAÇÃO
                await cadastrarCidade(
                    nome,
                    uf
                );

                alert("Cidade cadastrada com sucesso!");
            }

            await carregarDados(); // Atualiza a listagem do banco
            fecharModal();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        }

    };

    const handleAtivar = async (id: string) => {
        if(!id){
            alert('ID inválido');
        }

        try {
            await ativarCidade(id);
            alert("Cidade ativada com sucesso");
            await carregarDados();
        } catch (error) {
            alert(`Erro ao ativar cidade: ${error}`);
        }
    }

    const handleDesativar = async (id: string) => {
        if (!id) {
            alert("ID inválido");
            return;
        }

        try {
            // Certifique-se de importar e usar a função correta do seu service, ex: desativarCidade(id)
            await desativarCidade(id); 
            alert("Cidade desativada com sucesso!");
            await carregarDados(); // Atualiza a tabela
        } catch (error: any) {
            alert(`Erro ao desativar cidade: ${error.message || error}`);
        } 
    };

    return (
        <div className="abaRequisicaoConteudo">
            {/* BARRA VISUAL DE FILTROS */}
            <div className="barraFiltros">
                {/* Input de Busca Textual */}
                <input
                    type="text"
                    placeholder="Buscar por nome da cidade ou UF..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <button className="btnPagination" onClick={abrirModalAdicionar}>Adicionar Cidade</button>

            </div>

            {/* RENDERIZAÇÃO DA TABELA FILTRADA */}
            <div className="listaResultado">
                <table className="table tableRequisicao">
                    <thead>
                        <tr>
                            <th scope="col">Nome Cidade</th>
                            <th scope="col">UF</th>
                            <th scope="col">N° árvores</th>
                            <th scope="col">N° requisições</th>
                            <th scope="col">N° usuários</th>
                            <th scope="col" className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cidadesFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="mensagemVazio">
                                    Nenhum resultado encontrado com os filtros atuais.
                                </td>
                            </tr>
                        ) : (
                            cidadesFiltradas.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.nome}</strong></td>
                                    <td>{item.uf}</td>
                                    <td>{item._count?.arvores ?? 0}</td>
                                    <td>{item._count?.requisicoes ?? 0}</td>
                                    <td>{item._count?.usuarios ?? 0}</td>
                                    <td className="text-center">
                                        {item.ativa ? (
                                            <button type="button" className="btn btn-light btnStatusCidade" style={{ backgroundColor: "#", }} onClick={() => handleDesativar(item.id)}>
                                                Desativar
                                            </button>
                                        ) : (

                                            <button type="button" className="btnPagination btnAtivar btnStatusCidade" onClick={() => handleAtivar(item.id)}>
                                                Ativar
                                            </button>
                                        )}
                                        <button
                                            className="btnPagination btn-light m-1"
                                            onClick={() => abrirModalEditar(item.id)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* MODAL HÍBRIDO (ADICIONAR / EDITAR) */}
            <ModalForm
                aberto={modalAberto}
                fechar={fecharModal}
                titulo={
                    cidadeEmEdicaoId !== null
                        ? "Editar Cidade"
                        : "Adicionar Nova Cidade"
                }
                ariaLabelledBy="tituloModalCidade"
            >
                <div className="modalFormBody">
                    <form
                        onSubmit={handleSubmitForm}
                        className="formSection"
                    >
                        <div className="inputGroup mb-3">
                            <label htmlFor="nomeCidade">
                                Nome da Cidade *
                            </label>

                            <input
                                id="nomeCidade"
                                type="text"
                                placeholder="Ex: Catanduva"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className="inputGroup mb-3">
                            <label htmlFor="estado">
                                UF *
                            </label>

                            <select
                                name="estado"
                                id="estado"
                                value={uf}
                                onChange={(e) => setUf(e.target.value)}
                                required
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {estados.map((estado) => (
                                    <option
                                        key={estado.sigla}
                                        value={estado.sigla}
                                    >
                                        {estado.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btnPagination btn-secondary"
                                onClick={fecharModal}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btnPagination btn-success"
                            >
                                <FontAwesomeIcon icon={faCheck} />

                                {cidadeEmEdicaoId !== null
                                        ? "Salvar Alterações"
                                        : "Adicionar Cidade"}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalForm>

        </div>

    );
}