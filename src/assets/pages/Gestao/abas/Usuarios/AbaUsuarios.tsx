import { useEffect, useMemo, useState } from "react";
import ModalForm from "../../../../components/ModalForm/ModalForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { listarCidadesUsuario } from "../../../../../services/cidadeService";
import { type Role, type Cidade, type Usuario } from "../../../../../types";
import { ativarUsuario, atualizarUsuario, desativarUsuario, listarRoles, listarUsuarios, listarUsuariosCidade } from "../../../../../services/usuarioService";
import { obterUsuarioLogado } from "../../../../../services/authService";

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
    const [tipo, setTipo] = useState<Role | undefined>(undefined);
    const [cidadeId, setCidadeId] = useState("");

    //dados do select do form
    const [cidades, setCidades] = useState<Cidade[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
    const [cidadeFiltro, setCidadeFiltro] = useState("");
    const [roleFiltro, setRoleFiltro] = useState<Role >("FUNCIONARIO");

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const dadosCidades = await listarCidadesUsuario();
            setCidades(dadosCidades);
            console.log(dadosCidades);

            const dadosRoles = await listarRoles();
            setRoles(dadosRoles);

            const dadosLogado = await obterUsuarioLogado();
            setUsuarioLogado(dadosLogado.usuario);

            if (dadosLogado.usuario.role !== 'GLOBAL') {
                const dadosUsuarios = await listarUsuarios();
                setUsuarios(dadosUsuarios);
                return;
            }

            // Se for usuário GLOBAL busca todas as cidades para fazer filtro no select

            if (dadosCidades.length > 0) {

                const primeiraCidadeId = dadosCidades[0].id;
                setCidadeFiltro(primeiraCidadeId);

                const dadosUsuario = await listarUsuariosCidade(primeiraCidadeId, roleFiltro);
                setUsuarios(dadosUsuario);
                console.log('aqui');

                console.log(dadosUsuario);
            }

        } catch (error) {
            console.log("Erro ao carregar dados: ", error);
        }
    }

    const buscarUsuarios = async (cidade: string, role: Role) => {
        try {
            const dadosUsuarios = await listarUsuariosCidade(cidade, role);
            setUsuarios(dadosUsuarios);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
    };

    const buscarUsuarioCidade = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const cidade = e.target.value;

        setCidadeFiltro(cidade);

        await buscarUsuarios(cidade, roleFiltro);
    };

    const buscarUsuarioRole = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const role = e.target.value as Role;

        setRoleFiltro(role);

        await buscarUsuarios(cidadeFiltro, role);
    };

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
        setTipo(undefined);
        setTelefone("");
        setCidadeId("");

        if (usuarioLogado?.role === 'ADMIN_LOCAL') {
            setCidadeId(usuarioLogado.cidadeId || '');
        }
        setModalAberto(true);
    };

    // Função auxiliar para abrir o modal no modo Editar (passando o ID)
    const abrirModalEditar = (id: string) => {
        const usuarioAlvo = usuarios.find(item => item.id === id);
        if (!usuarioAlvo) return;

        setUsuarioEmEdicaoId(id);
        setNome(usuarioAlvo.nome || "");
        setEmail(usuarioAlvo.email || "");
        setTipo(usuarioAlvo.tipo || usuarioAlvo.role || undefined);
        setTelefone(usuarioAlvo.telefone || "");
        setCidadeId(usuarioAlvo.cidadeId || usuarioAlvo.cidade?.id || "");
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
                item.email.toLowerCase().includes(termo) ||
                item.telefone.toLowerCase().includes(termo);

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
                await atualizarUsuario(usuarioEmEdicaoId, nome, email, tipo, telefone, cidadeId);
                alert("Usuário atualizado com sucesso!");
            } else {
                // MODO CRIAÇÃO - Futura implementação, em razão da limitação de email do supabase 
                //await cadastrarCidade(nome,uf);
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
            await ativarUsuario(id);
            alert("Usuário ativada com sucesso");
            await carregarDados();
        } catch (error) {
            alert(`Erro ao ativar usuário: ${error}`);
        }
    }

    const handleDesativar = async (id: string) => {
        if (!id) {
            alert("ID inválido");
            return;
        }

        try {
            await desativarUsuario(id);
            alert("Uusário desativado com sucesso!");
            await carregarDados(); // Atualiza a tabela
        } catch (error: any) {
            alert(`Erro ao desativar usuário: ${error.message || error}`);
        }
    };

    return (
        <div className="abaRequisicaoConteudo">
            {/* BARRA VISUAL DE FILTROS */}
            <div className="barraFiltros">
                {/* Input de Busca Textual */}
                <input
                    type="text"
                    placeholder="Buscar por nome do usuário ou tipo"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                {usuarioLogado?.role === 'GLOBAL' && (
                    <select
                        value={cidadeFiltro}
                        onChange={buscarUsuarioCidade}
                    >
                        <option value="N">Nenhuma</option>
                        {cidades.map((item) => (
                            <option key={item.id} value={item.id}>{item.nome}</option>
                        ))}
                    </select>
                )}

                {usuarioLogado?.role === 'GLOBAL' && (
                    <select
                        value={roleFiltro}
                        onChange={buscarUsuarioRole}
                    >
                        {roles.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                )}

                <button className="btnPagination" onClick={abrirModalAdicionar}>Adicionar Usuário</button>

            </div>

            {/* RENDERIZAÇÃO DA TABELA FILTRADA */}
            <div className="listaResultado">
                <table className="table tableRequisicao">
                    <thead>
                        <tr>
                            <th scope="col">Nome Usuário</th>
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
                                    <td>{usuarioLogado?.id === item.id ? <FontAwesomeIcon icon={faUserAlt} /> : ""}<strong>{item.nome}</strong></td>
                                    <td>{item.email}</td>
                                    <td>{item.telefone}</td>
                                    <td>{item.role}</td>
                                    <td>{item.cidade?.nome}</td>
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
                                value={email}
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
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
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
                                onChange={(e) => {
                                    const valor = e.target.value;

                                    setTipo(valor === '' ? undefined : valor as Role)
                                }}
                                required
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {roles.map((role) => (
                                    <option
                                        key={role}
                                        value={role}
                                    >
                                        {role}
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
                                onChange={(e) => setCidadeId(e.target.value)}
                                disabled={usuarioLogado?.role === "ADMIN_LOCAL"}
                                className={usuarioLogado?.role === "ADMIN_LOCAL" ? "bg-light" : ""}

                            >
                                <option value="">
                                    Selecione
                                </option>

                                {cidades.map((cidade) => (
                                    <option
                                        key={cidade.id}
                                        value={cidade.id}
                                    >
                                        {cidade.nome}
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