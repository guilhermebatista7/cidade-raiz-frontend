import { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import './AbaArvores.css';

import { atualizarArvore, cadastrarArvore, excluirArvore, listarArvores } from "../../../../../services/arvoreService";

export function AbaArvores() {
    // 1. ESTADOS DE DADOS E CONTROLE DO MODAL
    const [arvores, setArvores] = useState<any[]>([]);
    const [modalAberto, setModalAberto] = useState(false);

    // Armazena o ID da árvore que está sendo editada (null = modo Adicionar)
    const [arvoreEmEdicaoId, setArvoreEmEdicaoId] = useState<string | null>(null);

    // Campos do formulário
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [imagem, setImagem] = useState<File | null>(null);

    // 2. ESTADOS DOS FILTROS
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const dados = await listarArvores();
            setArvores(dados);
        } catch (error) {
            console.log("Erro ao carregar árvores: ", error);
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
        setArvoreEmEdicaoId(null);
        setNome("");
        setDescricao("");
        setQuantidade("");
        setImagem(null);
        setModalAberto(true);
    };

    // Função auxiliar para abrir o modal no modo Editar (passando o ID)
    const abrirModalEditar = (id: string) => {
        const arvoreAlvo = arvores.find(item => item.id === id);
        if (!arvoreAlvo) return;

        setArvoreEmEdicaoId(id);
        setNome(arvoreAlvo.nomePopular || "");
        setDescricao(arvoreAlvo.descricao);
        setQuantidade(arvoreAlvo.quantidade.toString());
        setImagem(null); // Caso queira permitir alterar a imagem depois
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setArvoreEmEdicaoId(null);
    };

    // 3. LÓGICA DE FILTRAGEM REATIVA
    const arvoresFiltradas = useMemo(() => {
        return arvores.map(item => ({
            ...item,
            // Normaliza garantindo que nunca serão undefined/null para a busca
            nomePopular: item.nomePopular || "",
            descricao: item.descricao || ""
        })).filter((item) => {
            const termo = busca.toLowerCase();
            return (
                item.nomePopular.toLowerCase().includes(termo) ||
                item.descricao.toLowerCase().includes(termo)
            );
        });
    }, [arvores, busca]);

    // Manipulador unificado de salvamento (Adição ou Edição)
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !descricao || !quantidade) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            setCarregando(true);
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("descricao", descricao);
            formData.append("quantidade", quantidade);

            if (imagem) {
                formData.append("imagem", imagem); // Nova imagem opcional
            }

            if (arvoreEmEdicaoId !== null) {
                // MODO EDIÇÃO
                await atualizarArvore(arvoreEmEdicaoId, formData);
                alert("Árvore atualizada com sucesso!");
            } else {
                // MODO CRIAÇÃO
                await cadastrarArvore(formData);
                alert("Árvore cadastrada com sucesso!");
            }

            await carregarDados(); // Atualiza a listagem do banco
            fecharModal();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setCarregando(false);
        }
    };

    const handleExcluir = async (id: string) => {

        const confirm = window.confirm("Tem certeza que deseja excluir esta árvore?");
        if (!confirm) return;

        try {
            await excluirArvore(id);
            alert("Árvore excluída com sucesso!");
            await carregarDados();
        } catch (error) {
            alert('Não foi possível realizar a exclusão');
            console.log(error);
        }
    }

    return (
        <div className="abaArvoresConteudo">
            {/* BARRA VISUAL DE FILTROS */}
            <div className="barraFiltros">
                <input
                    type="text"
                    placeholder="Buscar por nome ou descrição"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                {busca && (
                    <button
                        type="button"
                        className="btnLimparFiltros"
                        onClick={() => setBusca("")}
                    >
                        Limpar Filtros
                    </button>
                )}

                <button
                    type="button"
                    className="btn btn-light"
                    onClick={abrirModalAdicionar}
                >
                    Adicionar
                </button>
            </div>

            {/* RENDERIZAÇÃO DA TABELA FILTRADA */}
            <div className="listaResultado">
                <div className="arvoresContainer">
                    <div className="arvoresGrid">
                        {arvoresFiltradas.map(arvore => {
                            const disponivel = arvore.quantidade > 0;

                            return (
                                <article key={arvore.id} className="arvoreCard">
                                    <div className="arvoreImagem">
                                        <img src={arvore.imagemUrl} alt={arvore.nomePopular} />
                                    </div>

                                    <div className="arvoreCardContent">
                                        <div className="arvoreCardTitle">
                                            <h3>{arvore.nomePopular}</h3>
                                            <span className={disponivel ? "disponivel" : "indisponivel"}>
                                                {disponivel ? `${arvore.quantidade} disponíveis` : "0 disponíveis"}
                                            </span>
                                        </div>

                                        <p>{arvore.descricao}</p>

                                        {/* Passamos o ID da árvore para o botão de editar */}
                                        <button
                                            className="btn btn-light m-1"
                                            onClick={() => abrirModalEditar(arvore.id)}
                                        >
                                            Editar
                                        </button>
                                        <button className="btn btn-light" onClick={() => handleExcluir(arvore.id)}>Excluir</button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* MODAL HÍBRIDO (ADICIONAR / EDITAR) */}
            {modalAberto && (
                <div
                    className="arvoresModalOverlay"
                    onMouseDown={e => e.target === e.currentTarget && fecharModal()}
                >
                    <div className="arvoresModal" role="dialog" aria-modal="true" aria-labelledby="tituloModalArvore">
                        <div className="arvoresModalHeader">
                            <div>
                                <h2 id="tituloModalArvore">
                                    {arvoreEmEdicaoId !== null ? "Editar Árvore" : "Adicionar Nova Árvore"}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="btnFecharModal"
                                onClick={fecharModal}
                                aria-label="Fechar modal"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className="arvoresModalBody p-3">
                            <form onSubmit={handleSubmitForm} className="formSection">
                                <div className="inputGroup mb-3">
                                    <label htmlFor="nomeArvore">Nome da Árvore *</label>
                                    <input
                                        id="nomeArvore"
                                        type="text"
                                        placeholder="Ex: Ipê Amarelo"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="inputGroup mb-3">
                                    <label htmlFor="descricaoArvore">Descrição *</label>
                                    <textarea
                                        id="descricaoArvore"
                                        placeholder="Digite uma breve descrição..."
                                        className="p-3 rounded-3"
                                        value={descricao}
                                        onChange={(e) => setDescricao(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="inputGroup mb-3">
                                    <label htmlFor="qtdArvore">Quantidade Disponível *</label>
                                    <input
                                        id="qtdArvore"
                                        type="number"
                                        placeholder="Ex: 10"
                                        value={quantidade}
                                        onChange={(e) => setQuantidade(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="inputGroup fotoArvore mb-3">
                                    <label>Foto da Árvore {arvoreEmEdicaoId !== null && "(Opcional alterar)"}</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="p-3"
                                        onChange={(e) => e.target.files?.[0] && setImagem(e.target.files[0])}
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={fecharModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={carregando}>
                                        <FontAwesomeIcon icon={faCheck} /> 
                                        {carregando ? "Salvando..." : (arvoreEmEdicaoId !== null ? "Salvar Alterações" : "Adicionar Árvore")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}