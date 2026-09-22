import { useEffect, useMemo, useState } from "react";
import ModalForm from "../../../../components/ModalForm/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { estados } from "../../../../dataInfo/estados";

export function AbaUsuarios() {

    // 1. ESTADOS DE DADOS E CONTROLE DO MODAL
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [modalAberto, setModalAberto] = useState(false);

    // Armazena o ID do usuário que está sendo editada (null = modo Adicionar)
    const [usuarioEmEdicaoId, setUsuarioEmEdicaoId] = useState<string | null>(null);

    // Campos do formulário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipo, setTipo] = useState("");
    const [cidadeId, setCidadeId] = useState("");


    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            //const dados = await listarCidades();
            //setCidades(dados);
            console.log('Nada')
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
        setUsuarioEmEdicaoId(null);
        setNome("");
        setEmail("");
        setTipo("");
        setTelefone("");
        setCidadeId("");
        setModalAberto(true);
    };

    // Função auxiliar para abrir o modal no modo Editar (passando o ID)
    const abrirModalEditar = (id: string) => {
        const usuarioAlvo = usuarios.find(item => item.id === id);
        if (!usuarioAlvo) return;

        setUsuarioEmEdicaoId(id);
        setNome(usuarioAlvo.nome || "");
        setEmail(usuarioAlvo.email || "");
        setTipo(usuarioAlvo.tipo || "");
        setTelefone(usuarioAlvo.telefone || "");
        setCidadeId(usuarioAlvo.cidadeId || "");
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setUsuarioEmEdicaoId(null);
    };

    // 2. ESTADOS DOS FILTROS
    const [busca, setBusca] = useState("");

    // 3. LÓGICA DE FILTRAGEM REATIVA COM useMemo
    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter((item) => {
            // Regra 1: Filtro de texto (busca por nome do cidadão, árvore ou bairro)
            const termo = busca.toLowerCase();
            const bateTexto =
                item.nome.toLowerCase().includes(termo) ||
                item.uf.toLowerCase().includes(termo);

            return bateTexto
        });
    }, [usuarios, busca]);

    // Manipulador unificado de salvamento (Adição ou Edição)
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome || !email || !tipo) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {

            if (usuarioEmEdicaoId !== null) {
                // MODO EDIÇÃO
                //await atualizarCidade(cidadeEmEdicaoId, nome, uf);
                alert("Cidade atualizada com sucesso!");
            } else {
                // MODO CRIAÇÃO
                //await cadastrarCidade(nome,uf);

                alert("Cidade cadastrada com sucesso!");
            }

            await carregarDados(); // Atualiza a listagem do banco
            fecharModal();
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        }

    };

    const handleAtivar = async (id: string) => {
        if (!id) {
            alert('ID inválido');
        }

        try {
           // await ativarCidade(id);
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
            //await desativarCidade(id);
            alert("Cidade desativada com sucesso!");
            await carregarDados(); // Atualiza a tabela
        } catch (error: any) {
            alert(`Erro ao desativar cidade: ${error.message || error}`);
        }
    };


    return (
        <div className="abaSolicitacaoConteudo">
            {/* BARRA VISUAL DE FILTROS */}
            <div className="barraFiltros">
                {/* Input de Busca Textual */}
                <input
                    type="text"
                    placeholder="Buscar por nome do usuário ou tipo"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <button className="btnPagination" onClick={abrirModalAdicionar}>Adicionar Usuário</button>

            </div>

            {/* RENDERIZAÇÃO DA TABELA FILTRADA */}
            <div className="listaResultado">
                <table className="table tableSolicitacao">
                    <thead>
                        <tr>
                            <th scope="col">Nome Cidade</th>
                            <th scope="col">Email</th>
                            <th scope="col">Telefone</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Cidade</th>
                            <th scope="col" className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="mensagemVazio">
                                    Nenhum resultado encontrado com os filtros atuais.
                                </td>
                            </tr>
                        ) : (
                            usuariosFiltrados.map((item) => (
                                <tr key={item.id}>
                                    <td><strong>{item.nome}</strong></td>
                                    <td>{item.email}</td>
                                    <td>{item.telefone}</td>
                                    <td>{item.tipo}</td>
                                    <td>{item.cidade}</td>
                                    <td className="text-center">
                                        {item.ativo ? (
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
                    usuarioEmEdicaoId !== null
                        ? "Editar Usuário"
                        : "Adicionar Novo Usuário"
                }
                ariaLabelledBy="tituloModalCidade"
            >
                <div className="modalFormBody">
                    <form
                        onSubmit={handleSubmitForm}
                        className="formSection"
                    >
                        <div className="inputGroup mb-3">
                            <label htmlFor="nome">
                                Nome do Usuário*
                            </label>

                            <input
                                id="nome"
                                type="text"
                                placeholder="Ex: João"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className="inputGroup mb-3">
                            <label htmlFor="email">
                                Email*
                            </label>

                            <input
                                id="email"
                                type="text"
                                placeholder="Ex: joao@gmail.com"
                                value={nome}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="inputGroup mb-3">
                            <label htmlFor="telefone">
                                Telefone*
                            </label>

                            <input
                                id="telefone"
                                type="text"
                                placeholder="Ex: (11) 1111111-1111"
                                value={nome}
                                onChange={(e) => setTelefone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="inputGroup mb-3">
                            <label htmlFor="tipo">
                                Tipo*
                            </label>

                            <select
                                name="tipo"
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
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

                        <div className="inputGroup mb-3">
                            <label htmlFor="cidade">
                                Cidade*
                            </label>

                            <select
                                name="cidade"
                                id="cidade"
                                value={cidadeId}
                                onChange={(e) => setTipo(e.target.value)}
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

                                {usuarioEmEdicaoId !== null
                                    ? "Salvar Alterações"
                                    : "Adicionar Usuario"}
                            </button>
                        </div>
                    </form>
                </div>
            </ModalForm>

        </div>

    );
}