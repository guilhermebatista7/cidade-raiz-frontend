import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCamera, faCheck, faFileLines, faHandHoldingHeart, faLeaf, faPaperPlane, faTrash, faXmark, faListCheck
} from "@fortawesome/free-solid-svg-icons";

import { SectionContent } from "../../components/SectionContent/SectionContent";
import { estados } from "../../dataInfo/estados";
import "./Plantar.css";

import { listarArvoresCidade } from "../../../services/arvoreService";
import { listarCidadesAtivas } from "../../../services/cidadeService";
import {
    atualizarRequisicao,
    cadastrarRequisicao,
    listarMinhasRequisicoes
} from "../../../services/requisicaoService";
import { obterUsuarioLogado } from "../../../services/authService";

import type { Publicacao, Requisicao, Usuario } from "../../../types";

import { useAlert } from "../../components/hooks/useAlert";
import Alert from "../../components/Alert/Alert";
import ModalRequisicaoPlantar from "../../components/ModalRequisicaoPlantar/ModalRequisicaoPlantar";
import { StatusRequisicao } from "../../components/StatusRequisicao/StatusRequisicao";
import { verificarPublicacao } from "../../../services/blogService";

import { buscarCep } from "../../../services/viaCepService";
import { formatarCep, formatarTelefone } from "../../../utils/formatadores";

export const Plantar = () => {
    const [fotoLocal, setFotoLocal] = useState<File | null>(null);
    const [comprovante, setComprovante] = useState<File | null>(null);

    const [modalArvoresAberto, setModalArvoresAberto] = useState(false);

    const [cidades, setCidades] = useState<any[]>([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");

    const [arvores, setArvores] = useState<any[]>([]);
    const [arvoreSelecionada, setArvoreSelecionada] = useState<string | null>(null);

    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [bairro, setBairro] = useState("");
    const [numero, setNumero] = useState("");
    const [pontoReferencia, setPontoReferencia] = useState("");
    const [telefone, setTelefone] = useState("");

    const [cepConsultado, setCepConsultado] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);

    const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

    const { alert, showAlert, closeAlert } = useAlert();

    const [modalAberto, setModalAberto] = useState(false);
    const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
    const [tipoAtendimento, setTipoAtendimento] = useState("");
    const [estadoSelecionado, setEstadoSelecionado] = useState("");
    const [fotoLocalUrl, setFotoLocalUrl] = useState<string | null>(null);
    const [comprovanteUrl, setComprovanteUrl] = useState<string | null>(null);

    /*
     * Quando null:
     * - estamos criando uma nova requisição.
     *
     * Quando preenchido:
     * - estamos verificando/editando uma requisição existente.
     */
    const [requisicaoSelecionada, setRequisicaoSelecionada] = useState<Requisicao | null>(null);
    const [publicacao, setPublicacao] = useState<Publicacao | null>(null);

    const modoVerificacao = requisicaoSelecionada !== null;

    /*
     * Somente requisições SOLICITADO ou RECUSADO
     * podem ter seus dados alterados.
     */
    const podeEditar =
        !modoVerificacao ||
        requisicaoSelecionada?.status === "SOLICITADO" ||
        requisicaoSelecionada?.status === "RECUSADO";

    /*
     * ============================================================
     * CARREGAMENTO INICIAL
     * ============================================================
     */

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        document.body.classList.toggle(
            "modalAberto",
            modalArvoresAberto
        );

        return () => {
            document.body.classList.remove("modalAberto");
        };
    }, [modalArvoresAberto]);

    useEffect(() => {
        if (!modalArvoresAberto) return;

        const fechar = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setModalArvoresAberto(false);
            }
        };

        document.addEventListener("keydown", fechar);

        return () => {
            document.removeEventListener("keydown", fechar);
        };
    }, [modalArvoresAberto]);

    const carregarDados = async () => {
        try {
            const dadosLogado = await obterUsuarioLogado();

            setUsuarioLogado(dadosLogado.usuario);

            const cidadesAtivas = await listarCidadesAtivas();
            setCidades(cidadesAtivas);

            const dadosRequisicoes = await listarMinhasRequisicoes();

            setRequisicoes(dadosRequisicoes);

            if (cidadesAtivas.length > 0) {
                const primeiraCidade = cidadesAtivas[0];

                setCidadeSelecionada(primeiraCidade.id);

                await carregarArvores(primeiraCidade.id);
            }
        } catch (error) {
            showAlert(
                `${error}`,
                "danger"
            );
        }
    };

    const carregarArvores = async (cidadeId: string) => {
        try {
            const dados = await listarArvoresCidade(cidadeId);

            setArvores(dados);
        } catch (error) {
            console.log(
                "Erro ao carregar árvores:",
                error
            );
        }
    };

    const handleBuscarCep = async () => {
        const cepLimpo = cep.replace(/\D/g, "");

        if (cepLimpo.length !== 8) {
            showAlert("Informe um CEP válido.", "warning");
            return;
        }

        setBuscandoCep(true);
        setCepConsultado(false);

        try {
            const dados = await buscarCep(cepLimpo);

            const cidadeAtual = cidades.find(
                cidade => cidade.id === cidadeSelecionada
            );

            const normalizar = (texto: string) =>
                texto.normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim()
                    .toLowerCase();

            if (
                cidadeAtual &&
                normalizar(cidadeAtual.nome) !==
                normalizar(dados.localidade)
            ) {
                showAlert(
                    `O CEP pertence a ${dados.localidade}/${dados.uf}, ` +
                    `não a ${cidadeAtual.nome}.`,
                    "warning"
                );
                return;
            }

            if (!dados.bairro) {
                showAlert(
                    "O ViaCEP não retornou um bairro para esse CEP.",
                    "warning"
                );
                return;
            }

            setRua(dados.logradouro ?? "");
            setBairro(dados.bairro);
            setEstadoSelecionado(dados.uf);
            setCepConsultado(true);

        } catch (error) {
            showAlert(
                error instanceof Error
                    ? error.message
                    : "Erro ao buscar o CEP.",
                "danger"
            );
        } finally {
            setBuscandoCep(false);
        }
    };

    /*
     * ============================================================
     * SELEÇÃO DE CIDADE
     * ============================================================
     */

    const handleCidadeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cidadeId = e.target.value;

        setCidadeSelecionada(cidadeId);

        setArvoreSelecionada(null);
        setArvores([]);

        if (!cidadeId) {
            return;
        }

        await carregarArvores(cidadeId);
    };

    /*
     * ============================================================
     * SELEÇÃO DE ARQUIVOS
     * ============================================================
     */

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFotoLocal(file);
        }
    };

    const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setComprovante(file);
        }
    };

    /*
     * ============================================================
     * ÁRVORE
     * ============================================================
     */

    const selecionarArvore = (id: string) => {
        /*
         * Se estiver visualizando uma requisição que não pode
         * ser editada, não permite trocar a árvore.
         */
        if (modoVerificacao && !podeEditar) {
            return;
        }

        const arvore = arvores.find(
            item => item.id === id
        );

        if (!arvore || arvore.quantidade <= 0) {
            return;
        }

        setArvoreSelecionada(id);
        setModalArvoresAberto(false);
    };

    const arvoreEscolhida = arvores.find(
        arvore => arvore.id === arvoreSelecionada
    );

    const cidadeEscolhida = cidades.find(
        cidade => cidade.id === cidadeSelecionada
    );

    /*
     * ============================================================
     * SELECIONAR REQUISIÇÃO
     * ============================================================
     * Essa é a função chamada pelo ModalRequisicaoPlantar.
     */

    const abrirArquivoNovaGuia = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const selecionarRequisicao = async (requisicao: Requisicao) => {
        try {
            setRequisicaoSelecionada(requisicao);

            setCep(formatarCep(requisicao.cep ?? ""));
            setRua(requisicao.rua ?? "");
            setNumero(requisicao.numero ?? "");
            setBairro(requisicao.bairro ?? "");
            setPontoReferencia(requisicao.pontoReferencia ?? "");

            setTelefone(
                formatarTelefone(requisicao.telefoneBeneficiario ?? "")
            );

            setCepConsultado(
                (requisicao.cep ?? "").replace(/\D/g, "").length === 8
            );

            const cidadeId = requisicao.cidade?.id ?? requisicao.cidadeId ?? "";
            setCidadeSelecionada(cidadeId);

            const arvoreId = requisicao.arvore?.id ?? requisicao.arvoreId ?? null;
            setArvoreSelecionada(arvoreId);

            /*
             * ========================================================
             * CARREGAR ÁRVORES DA CIDADE
             * ========================================================
             */

            setEstadoSelecionado(requisicao.estado ?? "");

            setTipoAtendimento(requisicao.tipoAtendimento);

            if (cidadeId) {
                await carregarArvores(cidadeId);
            }

            setFotoLocalUrl(
                requisicao.fotoLocalUrl ?? null
            );
            setFotoLocal(null);

            setComprovanteUrl(
                requisicao.comprovanteResidenciaUrl ?? null
            );
            setComprovante(null);

            const publicacaoExistente = await verificarPublicacao(requisicao.id);
            setPublicacao(publicacaoExistente);

            setModalAberto(false);

        } catch (error) {
            console.error(
                "Erro ao carregar requisição:",
                error
            );

            showAlert(
                "Não foi possível carregar os arquivos da requisição.",
                "danger"
            );
        }
    };

    const obterNomeArquivoComprovante = (url: string): string => {
        try {
            const urlObj = new URL(url);
            const caminho = urlObj.pathname;
            const nome = caminho
                .split("/")
                .pop();

            if (nome) {
                return nome;
            }
        } catch {
            // Ignora erro e usa nome padrão
        }

        return "comprovante-residencia.pdf";
    };

    /*
     * ============================================================
     * SUBMIT
     * ============================================================
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        /*
         * Se estamos verificando uma requisição existente,
         * primeiro verificamos se ela pode ser editada.
         */
        if (modoVerificacao) {
            if (!podeEditar) {
                showAlert(
                    "Esta requisição não pode mais ser alterada.",
                    "warning"
                );

                return;
            }
        }

        /*
         * Validação da cidade
         */
        if (!cidadeSelecionada) {
            showAlert(
                "Por favor, selecione uma cidade.",
                "warning"
            );
            return;
        }

        /*
         * Validação da árvore
         */
        if (!arvoreSelecionada) {
            showAlert(
                "Por favor, escolha uma árvore antes de enviar a requisição.",
                "warning"
            );

            setModalArvoresAberto(true);
            return;
        }

        /*
         * Foto e comprovante são obrigatórios somente
         * na criação de uma nova requisição.
         *
         * Na edição, a requisição já pode possuir esses arquivos.
         */
        if (!modoVerificacao && !fotoLocal) {
            showAlert(
                "Por favor, adicione a foto do local para plantio.",
                "warning"
            );

            return;
        }

        if (!modoVerificacao && !comprovante) {
            showAlert(
                "Por favor, adicione um comprovante de residência.",
                "warning"
            );

            return;
        }

        const formData = new FormData(
            e.currentTarget
        );

        /*
         * ========================================================
         * NOVA REQUISIÇÃO
         * ========================================================
         */

        if (!modoVerificacao) {
            enviarDados(formData);
            return;
        }

        /*
         * ========================================================
         * ATUALIZAÇÃO
         * ========================================================
         *
         * atualizarRequisicao(requisicaoSelecionada.id, formData)
         *
         */
        atualizarDados(
            requisicaoSelecionada!.id,
            formData
        );
    };

    /*
     * ============================================================
     * CADASTRAR
     * ============================================================
     */

    const enviarDados = async (
        formData: FormData
    ) => {
        try {
            await cadastrarRequisicao(formData);

            showAlert(
                "Requisição enviada com sucesso!",
                "success"
            );

            /*
             * Volta para o modo de criação.
             */
            setRequisicaoSelecionada(null);

            /*
             * Atualiza a lista.
             */
            const dados =
                await listarMinhasRequisicoes();

            setRequisicoes(dados);

            novaRequisicao();
            carregarDados();
        } catch (error) {
            showAlert(
                `Erro ao cadastrar requisição: ${error}`,
                "danger"
            );
        }
    };

    /*
     * ============================================================
     * ATUALIZAR
     * ============================================================
     */

    const atualizarDados = async (
        requisicaoId: string,
        formData: FormData
    ) => {
        try {

            await atualizarRequisicao(
                requisicaoId,
                formData
            );


            showAlert(
                "Requisição atualizada com sucesso!",
                "success"
            );

            novaRequisicao();
            carregarDados();
        } catch (error) {
            showAlert(
                `Erro ao atualizar requisição: ${error}`,
                "danger"
            );
        }
    };

    /*
     * ============================================================
     * MODAL DE REQUISIÇÕES
     * ============================================================
     */

    const abrirModalRequisicao = () => {
        setModalAberto(true);
    };

    const fecharModalRequisicao = () => {
        setModalAberto(false);
    };

    /*
     * ============================================================
     * NOVA REQUISIÇÃO
     * ============================================================
     */

    const novaRequisicao = () => {
        setRequisicaoSelecionada(null);

        setCep("");
        setRua("");
        setBairro("");
        setNumero("");
        setPontoReferencia("");
        setTelefone("");

        setCepConsultado(false);
        setBuscandoCep(false);
        setEstadoSelecionado("");

        setFotoLocal(null);
        setComprovante(null);

        setFotoLocalUrl(null);
        setComprovanteUrl(null);

        setArvoreSelecionada(null);

        if (cidades.length > 0) {
            setCidadeSelecionada(
                cidades[0].id
            );
        }
    };

    return (
        <SectionContent className="sectionPlantar">
            <div className="container-fluid">

                <form className="plantarLayout" onSubmit={handleSubmit}>

                    <div className="solicitacaoCard">

                        {alert && (
                            <Alert
                                message={alert.message}
                                type={alert.type}
                                onClose={closeAlert}
                            />
                        )}

                        {/* =====================================================
                            CABEÇALHO
                        ====================================================== */}

                        <div className="solicitacaoHeader d-flex flex-column">
                            <div className="reqHeadButtons flex-row justify-content-end gap-2 w-100">
                                <button
                                    type="button"
                                    className="btnEnviar"
                                    onClick={
                                        abrirModalRequisicao
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faListCheck}
                                    />

                                    {" "}Minhas requisições
                                </button>

                                {modoVerificacao && (
                                    <button
                                        type="button"
                                        className="btnEnviar"
                                        onClick={novaRequisicao}
                                        style={{
                                            marginBottom: "10px"
                                        }}
                                    >
                                        Nova requisição
                                    </button>
                                )}
                            </div>

                            <div className="d-flex flex-row justify-content-between align-items-center w-100">
                                <div>
                                    <h2>
                                        {modoVerificacao
                                            ? `Verificar Requisição - ${requisicaoSelecionada?.nomeBeneficiario || ""}`
                                            : "Nova Requisição de Plantio"}
                                    </h2>
                                    <p>
                                        {modoVerificacao
                                            ? podeEditar
                                                ? "Confira os dados da requisição e faça as alterações necessárias."
                                                : "Obs: Não é possível alterar os dados desta requisição."
                                            : "Preencha os dados abaixo para solicitar o plantio de uma árvore."
                                        }
                                    </p>
                                </div>
                                <div className="plantarHeaderIcon">
                                    <FontAwesomeIcon
                                        icon={faHandHoldingHeart}
                                    />
                                </div>
                            </div>

                            {requisicaoSelecionada?.status === "RECUSADO" && (
                                <div className="alert alert-danger mt-3 w-100" role="alert">
                                    Esta requisição foi recusada, faça as alterações necessárias.
                                    <br /><strong> Motivo</strong>: {requisicaoSelecionada.observacaoStatus || "Não informado."}
                                </div>
                            )}


                        </div>

                        {/* =====================================================
                            1 - FOTO E ÁRVORE
                        ====================================================== */}

                        <div className="formSection">

                            <div className="sectionTitle">
                                <span>1.</span>
                                <h3>Foto do local</h3>
                            </div>

                            <p className="sectionDescription">
                                Envie uma foto do local onde deseja o plantio.
                            </p>

                            <div className="photoUpload">

                                <label
                                    htmlFor="fotoLocal"
                                    className="addPhoto"
                                >
                                    <div className="cameraIcon">
                                        <FontAwesomeIcon
                                            icon={faCamera}
                                        />
                                    </div>

                                    <strong>
                                        {fotoLocal ? (
                                            <>
                                                Foto adicionada com sucesso{" "}
                                                <FontAwesomeIcon
                                                    className="successIcon"
                                                    icon={faCheck}
                                                />
                                            </>
                                        ) : (
                                            "Adicionar foto do local"
                                        )}
                                    </strong>

                                    <span>
                                        {fotoLocal
                                            ? "Clique para alterar a imagem"
                                            : "Clique para adicionar uma imagem"}
                                    </span>

                                    <input
                                        id="fotoLocal"
                                        name="fotoLocal"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        disabled={
                                            modoVerificacao &&
                                            !podeEditar
                                        }
                                    />

                                </label>

                                {fotoLocal && (
                                    <div className="photoPreview">

                                        <img
                                            src={URL.createObjectURL(
                                                fotoLocal
                                            )}
                                            alt="Preview da foto do local"
                                        />

                                    </div>
                                )}

                                {fotoLocalUrl && !fotoLocal && (
                                    <div
                                        className="photoPreview"
                                        onClick={() =>
                                            abrirArquivoNovaGuia(fotoLocalUrl)
                                        }
                                        style={{ cursor: "pointer" }}
                                        title="Clique para abrir a foto em uma nova guia"
                                    >
                                        <img
                                            src={fotoLocalUrl}
                                            alt="Foto do local"
                                        />
                                    </div>
                                )}

                            </div>

                            <div className="arvoresOption">

                                <div className="arvoresOptionInfo">

                                    <div className="arvoresOptionIcon">
                                        <FontAwesomeIcon
                                            icon={faLeaf}
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            Escolha a árvore para o plantio
                                        </strong>

                                        <span>
                                            Consulte as espécies disponíveis
                                            e escolha a que deseja plantar.
                                        </span>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="btnSelecionarArvore"
                                    onClick={() =>
                                        setModalArvoresAberto(true)
                                    }
                                    disabled={
                                        modoVerificacao &&
                                        !podeEditar
                                    }
                                >
                                    {arvoreEscolhida
                                        ? `Árvore: ${arvoreEscolhida.nomePopular}`
                                        : "Ver árvores disponíveis"}
                                </button>

                            </div>

                            {arvoreEscolhida && (
                                <div className="arvoreSelecionada">

                                    <div className="arvoreSelecionadaImagem">
                                        <img src={arvoreEscolhida.imagemUrl} alt={arvoreEscolhida.nome} />
                                    </div>

                                    <div className="arvoreSelecionadaInfo">
                                        <span>
                                            Árvore selecionada
                                        </span>

                                        <strong>
                                            {arvoreEscolhida.nomePopular}
                                        </strong>

                                        <p>
                                            {arvoreEscolhida.descricao}
                                        </p>

                                        <small>
                                            {arvoreEscolhida.quantidade}{" "}
                                            disponíveis
                                        </small>
                                    </div>

                                    <button
                                        type="button"
                                        className="btnAlterarArvore"
                                        onClick={() => setModalArvoresAberto(true)}
                                        disabled={modoVerificacao && !podeEditar}
                                    >
                                        Alterar
                                    </button>

                                </div>
                            )}

                            <input
                                type="hidden"
                                name="criadoPorId"
                                value={usuarioLogado?.id ?? ""}
                            />

                            <input
                                type="hidden"
                                name="requisicaoId"
                                value={requisicaoSelecionada?.id ?? ""}
                            />

                            <input
                                type="hidden"
                                name="arvoreId"
                                value={arvoreSelecionada ?? ""}
                            />

                            <div className="col-md-12 mt-2">
                                <div className="inputGroup">
                                    <label htmlFor="cidadeId">
                                        Árvore selecionada com base na cidade *
                                    </label>

                                    <select
                                        id="cidadeId"
                                        name="cidadeId"
                                        value={cidadeSelecionada}
                                        onChange={handleCidadeChange}
                                        required
                                        disabled={modoVerificacao && !podeEditar}
                                    >
                                        <option
                                            value=""
                                            disabled
                                        >
                                            Selecione a cidade
                                        </option>

                                        {cidades.map(
                                            cidade => (
                                                <option
                                                    key={cidade.id}
                                                    value={cidade.id}
                                                >
                                                    {cidade.nome}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                            2 - INFORMAÇÕES PESSOAIS
                        ====================================================== */}

                        <div className="formSection">

                            <div className="sectionTitle">
                                <span>2.</span>
                                <h3>Informações pessoais</h3>
                            </div>

                            <p className="sectionDescription">
                                Informe os dados do solicitante.
                            </p>

                            <div className="row g-3">

                                <div className="col-md-12">

                                    <div className="inputGroup">

                                        <label htmlFor="nomeBeneficiario">
                                            Nome
                                        </label>

                                        <input
                                            id="nomeBeneficiario"
                                            name="nomeBeneficiario"
                                            type="text"
                                            placeholder="Digite seu nome"
                                            defaultValue={requisicaoSelecionada?.nomeBeneficiario ?? ""}
                                            required
                                            disabled={modoVerificacao && !podeEditar}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-4">

                                    <div className="inputGroup">

                                        <label htmlFor="telefoneBeneficiario">
                                            Telefone
                                        </label>

                                        <input
                                            id="telefoneBeneficiario"
                                            name="telefoneBeneficiario"
                                            type="text"
                                            placeholder="(11) 11111-1111"
                                            defaultValue={requisicaoSelecionada?.telefoneBeneficiario ?? ""}
                                            required
                                            disabled={modoVerificacao && !podeEditar}
                                        />

                                    </div>
                                </div>

                                <div className="col-md-8">

                                    <div className="inputGroup">

                                        <label>
                                            Deseja retirar no local ou
                                            agendar o plantio e deixar por
                                            nossa conta?
                                        </label>

                                        <div className="tipoSolicitacao d-flex align-items-center gap-3">

                                            <div className="d-flex align-items-center gap-1">

                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    id="retirar"
                                                    name="tipoAtendimento"
                                                    value="RETIRADA_LOCAL"
                                                    checked={tipoAtendimento === "RETIRADA_LOCAL"}
                                                    onChange={(e) => setTipoAtendimento(e.target.value)}
                                                    disabled={modoVerificacao && !podeEditar}
                                                />

                                                <label htmlFor="retirar">
                                                    Retirar no local
                                                </label>

                                            </div>

                                            <div className="d-flex align-items-center gap-1">

                                                <input
                                                    type="radio"
                                                    className="radio"
                                                    id="agendar"
                                                    name="tipoAtendimento"
                                                    value="PLANTIO_AGENDADO"
                                                    checked={tipoAtendimento === "PLANTIO_AGENDADO"}
                                                    onChange={(e) => setTipoAtendimento(e.target.value)}
                                                    disabled={modoVerificacao && !podeEditar}
                                                />

                                                <label htmlFor="agendar">
                                                    Agendar plantio
                                                </label>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =====================================================
                            3 - ENDEREÇO
                        ====================================================== */}

                        <div className="formSection">

                            <div className="sectionTitle">
                                <span>3.</span>
                                <h3>Endereço do local</h3>
                            </div>

                            <p className="sectionDescription">
                                Informe o endereço onde o plantio será realizado.
                            </p>

                            <div className="row g-3">

                                {/* CIDADE */}
                                <div className="col-md-5">
                                    <div className="inputGroup">
                                        <label htmlFor="cidadeEndereco">Cidade *</label>

                                        <input
                                            id="cidadeEndereco"
                                            name="cidadeEndereco"
                                            type="text"
                                            value={
                                                cidadeEscolhida?.nome ??
                                                requisicaoSelecionada?.cidade?.nome ??
                                                ""
                                            }
                                            readOnly
                                        />
                                    </div>
                                </div>


                                {/* CEP */}
                                <div className="col-md-7">
                                    <div className="inputGroup">
                                        <label htmlFor="cep">CEP *</label>

                                        <div className="cepInputGroup">
                                            <input
                                                id="cep"
                                                name="cep"
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="00000-000"
                                                maxLength={9}
                                                value={cep}
                                                onChange={e => {
                                                    setCep(formatarCep(e.target.value));
                                                    setCepConsultado(false);
                                                    setRua("");
                                                    setBairro("");
                                                    setNumero("");
                                                    setEstadoSelecionado("");
                                                }}
                                                required
                                                disabled={modoVerificacao && !podeEditar}
                                            />

                                            <button
                                                type="button"
                                                className="btnBuscarCep"
                                                onClick={handleBuscarCep}
                                                disabled={
                                                    buscandoCep ||
                                                    cep.replace(/\D/g, "").length !== 8 ||
                                                    (modoVerificacao && !podeEditar)
                                                }
                                            >
                                                {buscandoCep ? "Buscando..." : "Buscar CEP"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* CAMPOS EXIBIDOS APÓS A CONSULTA */}
                                {cepConsultado && (
                                    <>

                                        {/* RUA */}
                                        <div className="col-md-8">
                                            <div className="inputGroup">
                                                <label htmlFor="rua">
                                                    Rua / Avenida *
                                                </label>

                                                <input
                                                    id="rua"
                                                    name="rua"
                                                    type="text"
                                                    value={rua}
                                                    onChange={e => setRua(e.target.value)}
                                                    placeholder="Digite a rua"
                                                    required
                                                    disabled={modoVerificacao && !podeEditar}
                                                />
                                            </div>
                                        </div>

                                        {/* NÚMERO */}
                                        <div className="col-md-4">
                                            <div className="inputGroup">
                                                <label htmlFor="numero">Número *</label>

                                                <input
                                                    id="numero"
                                                    name="numero"
                                                    type="text"
                                                    value={numero}
                                                    onChange={e => setNumero(e.target.value)}
                                                    placeholder="Nº"
                                                    required
                                                    disabled={modoVerificacao && !podeEditar}
                                                />
                                            </div>
                                        </div>

                                        {/* BAIRRO */}
                                        <div className="col-md-8">
                                            <div className="inputGroup">
                                                <label htmlFor="bairro">Bairro *</label>

                                                <input
                                                    id="bairro"
                                                    name="bairro"
                                                    type="text"
                                                    value={bairro}
                                                    readOnly
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* ESTADO */}
                                        <div className="col-md-4">
                                            <div className="inputGroup">
                                                <label htmlFor="estado">Estado *</label>

                                                <input
                                                    id="estado"
                                                    name="estado"
                                                    type="text"
                                                    value={estadoSelecionado}
                                                    readOnly
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* PONTO DE REFERÊNCIA */}
                                        <div className="col-12">
                                            <div className="inputGroup">
                                                <label htmlFor="pontoReferencia">
                                                    Ponto de referência (opcional)
                                                </label>

                                                <input
                                                    id="pontoReferencia"
                                                    name="pontoReferencia"
                                                    type="text"
                                                    value={pontoReferencia}
                                                    onChange={e =>
                                                        setPontoReferencia(e.target.value)
                                                    }
                                                    placeholder="Ex: próximo ao ponto de ônibus..."
                                                    disabled={modoVerificacao && !podeEditar}
                                                />
                                            </div>
                                        </div>

                                    </>
                                )}

                            </div>

                        </div>

                        {/* =====================================================
                            4 - COMPROVANTE
                        ====================================================== */}

                        <div className="formSection">

                            <div className="sectionTitle">
                                <span>4.</span>
                                <h3>Comprovante de residência</h3>
                            </div>

                            <p className="sectionDescription">
                                Anexe um comprovante de residência atualizado.
                            </p>

                            <label
                                htmlFor="comprovante"
                                className="comprovanteUpload"
                            >

                                <strong>
                                    Selecionar comprovante
                                </strong>

                                <span>
                                    (PDF, JPG ou PNG)
                                </span>

                                <input
                                    id="comprovante"
                                    name="comprovante"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleComprovanteChange}
                                    disabled={modoVerificacao && !podeEditar}
                                />

                            </label>

                            {comprovante && (
                                <div className="fileUploaded">

                                    <div className="fileIcon">
                                        <FontAwesomeIcon
                                            icon={faFileLines}
                                        />
                                    </div>

                                    <div className="fileInfo">

                                        <strong>
                                            {comprovante.name}
                                        </strong>

                                        <span>
                                            {(
                                                comprovante.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            MB
                                        </span>

                                    </div>

                                    <button
                                        type="button"
                                        className="deleteFile"
                                        onClick={() =>
                                            setComprovante(
                                                null
                                            )
                                        }
                                        title="Remover arquivo"
                                        disabled={
                                            modoVerificacao &&
                                            !podeEditar
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                        />
                                    </button>

                                </div>
                            )}

                            {comprovanteUrl && !comprovante && (
                                <div
                                    className="fileUploaded"
                                    onClick={() =>
                                        abrirArquivoNovaGuia(comprovanteUrl)
                                    }
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    title="Clique para abrir o comprovante em uma nova guia"
                                >
                                    <div className="fileIcon">
                                        <FontAwesomeIcon
                                            icon={faFileLines}
                                        />
                                    </div>

                                    <div className="fileInfo">
                                        <strong>
                                            {obterNomeArquivoComprovante(
                                                comprovanteUrl
                                            )}
                                        </strong>

                                        <span>
                                            Clique para visualizar
                                        </span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* =====================================================
                            BOTÃO PRINCIPAL
                        ====================================================== */}

                        <button
                            type="submit"
                            className="btnEnviar"
                            disabled={
                                modoVerificacao &&
                                !podeEditar
                            }
                        >

                            <FontAwesomeIcon
                                icon={
                                    modoVerificacao
                                        ? faCheck
                                        : faPaperPlane
                                }
                            />

                            {modoVerificacao
                                ? requisicaoSelecionada?.status === "RECUSADO"
                                    ? " Reenviar requisição"
                                    : " Atualizar requisição"
                                : " Enviar requisição"}

                        </button>

                    </div>

                    {/* =========================================================
                        COLUNA DE STATUS
                    ========================================================== */}

                    <div className="statusColumn">

                        <div className="reqStatusButtons flex-row justify-content-end gap-2 w-100">
                            <button
                                type="button"
                                className="btnEnviar mb-1"
                                onClick={
                                    abrirModalRequisicao
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faListCheck}
                                />

                                {" "}Minhas requisições
                            </button>

                            {modoVerificacao && (
                                <button
                                    type="button"
                                    className="btnEnviar"
                                    onClick={novaRequisicao}
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                >
                                    Nova requisição
                                </button>
                            )}
                        </div>

                        <div className="statusCard">

                            <StatusRequisicao
                                requisicao={requisicaoSelecionada}
                                onFotoPlantioSalva={(requisicaoAtualizada) => {
                                    setRequisicaoSelecionada(requisicaoAtualizada);

                                    setRequisicoes(prev =>
                                        prev.map(req =>
                                            req.id === requisicaoAtualizada.id
                                                ? requisicaoAtualizada
                                                : req
                                        )
                                    );
                                }}
                                publicacao={publicacao}
                            />

                        </div>

                    </div>

                </form>

            </div>

            {/* =============================================================
                MODAL DE ÁRVORES
            ============================================================= */}

            {modalArvoresAberto && (

                <div
                    className="arvoresModalOverlay"
                    onMouseDown={e =>
                        e.target === e.currentTarget &&
                        setModalArvoresAberto(false)
                    }
                >

                    <div
                        className="arvoresModal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tituloModalArvores"
                    >

                        <div className="arvoresModalHeader">

                            <div>

                                <h2 id="tituloModalArvores">
                                    Árvores disponíveis
                                </h2>

                                <p>
                                    Escolha a espécie que deseja
                                    para o seu plantio.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="btnFecharModal"
                                onClick={() =>
                                    setModalArvoresAberto(
                                        false
                                    )
                                }
                                aria-label="Fechar modal"
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                />
                            </button>

                        </div>

                        <div className="arvoresModalBody">

                            <div className="arvoresGrid">

                                {arvores.map(arvore => {

                                    const selecionada =
                                        arvoreSelecionada ===
                                        arvore.id;

                                    const disponivel =
                                        arvore.quantidade > 0;

                                    return (

                                        <article
                                            key={arvore.id}
                                            className={`arvoreCard ${selecionada
                                                ? "selected"
                                                : ""
                                                } ${!disponivel
                                                    ? "indisponivelCard"
                                                    : ""
                                                }`}
                                            onClick={() =>
                                                disponivel &&
                                                selecionarArvore(
                                                    arvore.id
                                                )
                                            }
                                        >

                                            <div className="arvoreImagem">

                                                <img
                                                    src={
                                                        arvore.imagemUrl
                                                    }
                                                    alt={
                                                        arvore.nome
                                                    }
                                                />

                                            </div>

                                            <div className="arvoreCardContent">

                                                <div className="arvoreCardTitle">

                                                    <h3>
                                                        {
                                                            arvore.nomePopular
                                                        }
                                                    </h3>

                                                    <span
                                                        className={
                                                            disponivel
                                                                ? "disponivel"
                                                                : "indisponivel"
                                                        }
                                                    >
                                                        {disponivel
                                                            ? `${arvore.quantidade} disponíveis`
                                                            : "Indisponível"}
                                                    </span>

                                                </div>

                                                <p>
                                                    {
                                                        arvore.descricao
                                                    }
                                                </p>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        !disponivel ||
                                                        (modoVerificacao &&
                                                            !podeEditar)
                                                    }
                                                    className="btnEscolherArvore"
                                                    onClick={e => {
                                                        e.stopPropagation();

                                                        selecionarArvore(
                                                            arvore.id
                                                        );
                                                    }}
                                                >

                                                    {selecionada ? (
                                                        <>
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCheck
                                                                }
                                                            />{" "}
                                                            Árvore selecionada
                                                        </>
                                                    ) : disponivel ? (
                                                        "Escolher esta árvore"
                                                    ) : (
                                                        "Indisponível"
                                                    )}

                                                </button>

                                            </div>

                                        </article>

                                    );
                                })}

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* =============================================================
                MODAL DE REQUISIÇÕES
            ============================================================= */}

            <ModalRequisicaoPlantar
                aberto={modalAberto}
                fechar={fecharModalRequisicao}
                requisicoes={requisicoes}
                onSelecionar={selecionarRequisicao}
            />

        </SectionContent>
    );
};
