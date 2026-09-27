import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCamera, faCheck, faFileLines, faHandHoldingHeart, faLeaf,
    faPaperPlane, faTrash, faClock, faCalendarCheck, faXmark
} from "@fortawesome/free-solid-svg-icons";
import { SectionContent } from "../../components/SectionContent/SectionContent";
import { estados } from "../../dataInfo/estados";
import "./Plantar.css";
import { listarArvoresCidade } from "../../../services/arvoreService";
import { listarCidadesAtivas } from "../../../services/cidadeService";
import { cadastrarRequisicao } from "../../../services/requisicaoService";
import { obterUsuarioLogado } from "../../../services/authService";
import type { Usuario } from "../../../types";
import { useAlert } from "../../components/hooks/useAlert";
import Alert from "../../components/Alert/Alert";

export const Plantar = () => {
    const [fotoLocal, setFotoLocal] = useState<File | null>(null);
    const [comprovante, setComprovante] = useState<File | null>(null);
    const [modalArvoresAberto, setModalArvoresAberto] = useState(false);

    const [cidades, setCidades] = useState<any[]>([]);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");
    const [arvores, setArvores] = useState<any[]>([]);
    const [arvoreSelecionada, setArvoreSelecionada] = useState<string | null>(null);

    const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
    const { alert, showAlert, closeAlert } = useAlert();



    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        document.body.classList.toggle("modalAberto", modalArvoresAberto);
        return () => document.body.classList.remove("modalAberto");
    }, [modalArvoresAberto]);

    useEffect(() => {
        if (!modalArvoresAberto) return;
        const fechar = (e: KeyboardEvent) => e.key === "Escape" && setModalArvoresAberto(false);
        document.addEventListener("keydown", fechar);
        return () => document.removeEventListener("keydown", fechar);
    }, [modalArvoresAberto]);

    const carregarDados = async () => {
        try {
            const dadosLogado = await obterUsuarioLogado();
            setUsuarioLogado(dadosLogado.usuario);

            console.log("USUÁRIO LOGADO:", dadosLogado.usuario);

            const cidadeAtivas = await listarCidadesAtivas();
            setCidades(cidadeAtivas);

            if (cidadeAtivas.length > 0) {
                const primeiraCidade = cidadeAtivas[0];
                setCidadeSelecionada(primeiraCidade.id);
                await carregarArvores(primeiraCidade.id);
            }
        } catch (error) {
            showAlert(
                `${error}`,
                "danger"
            );
        }
    }

    const carregarArvores = async (cidadeId: string) => {
        try {
            const dados = await listarArvoresCidade(cidadeId);
            setArvores(dados);
            console.log(dados);
        } catch (error) {
            console.log("Erro ao carregar árvores: ", error);
        }
    }

    const handleCidadeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cidadeId = e.target.value;

        setCidadeSelecionada(cidadeId);

        // A árvore selecionada anteriormente não pertence
        // necessariamente à nova cidade.
        setArvoreSelecionada(null);
        setArvores([]);

        if (!cidadeId) {
            return;
        }

        await carregarArvores(cidadeId);
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setFotoLocal(file);
    };

    const handleComprovanteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setComprovante(file);
    };

    const selecionarArvore = (id: string) => {
        const arvore = arvores.find(item => item.id === id);
        if (!arvore || arvore.quantidade <= 0) return;
        setArvoreSelecionada(id);
        setModalArvoresAberto(false);
    };

    const arvoreEscolhida = arvores.find(
        arvore => arvore.id === arvoreSelecionada
    );

    const cidadeEscolhida = cidades.find(
        cidade => cidade.id === cidadeSelecionada
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!cidadeSelecionada) {
            showAlert(
                `Por favor, selecione uma cidade.`,
                "warning"
            );
            return;
        }

        if (!fotoLocal) {
            showAlert(
                "Por favor, adicione a foto do local para plantio.",
                "warning"
            );
            return;
        }

        if (!arvoreSelecionada) {
            showAlert(
                "Por favor, escolha uma árvore antes de enviar a requisição.",
                "warning"
            );
            setModalArvoresAberto(true);
            return;
        }

        if (!comprovante) {
            showAlert(
                "Por favor, adicione um comprovante de residência.",
                "warning"
            );
            return;
        }

        const formData = new FormData(e.currentTarget);
        enviarDados(formData);
    };

    const enviarDados = async (formData: FormData) => {
        try {
            await cadastrarRequisicao(formData);
            showAlert(
                "Requisição enviada com sucesso!",
                "success"
            );
        } catch (error) {
            showAlert(
                `Erro ao cadastrar requisição: ${error}`,
                "danger"
            );
        }
    }

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
                        <div className="solicitacaoHeader">
                            <div>
                                <h2>Nova Requisição de Plantio</h2>
                                <p>Preencha os dados abaixo para solicitar o plantio de uma árvore.</p>
                            </div>
                            <div className="plantarHeaderIcon">
                                <FontAwesomeIcon icon={faHandHoldingHeart} />
                            </div>
                        </div>

                        <div className="formSection">
                            <div className="sectionTitle">
                                <span>1.</span><h3>Foto do local</h3>
                            </div>
                            <p className="sectionDescription">
                                Envie uma foto do local onde deseja o plantio.
                            </p>

                            <div className="photoUpload">
                                <label htmlFor="fotoLocal" className="addPhoto">
                                    <div className="cameraIcon">
                                        <FontAwesomeIcon icon={faCamera} />
                                    </div>
                                    <strong>
                                        {fotoLocal
                                            ? <>Foto adicionada com sucesso <FontAwesomeIcon className="successIcon" icon={faCheck} /></>
                                            : "Adicionar foto do local"}
                                    </strong>
                                    <span>
                                        {fotoLocal ? "Clique para alterar a imagem" : "Clique para adicionar uma imagem"}
                                    </span>
                                    <input
                                        id="fotoLocal"
                                        name="fotoLocal"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                    />
                                </label>

                                {fotoLocal && (
                                    <div className="photoPreview">
                                        <img
                                            src={URL.createObjectURL(fotoLocal)}
                                            alt="Preview da foto do local"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="arvoresOption">
                                <div className="arvoresOptionInfo">
                                    <div className="arvoresOptionIcon">
                                        <FontAwesomeIcon icon={faLeaf} />
                                    </div>
                                    <div>
                                        <strong>Escolha a árvore para o plantio</strong>
                                        <span>Consulte as espécies disponíveis e escolha a que deseja plantar.</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btnSelecionarArvore"
                                    onClick={() => setModalArvoresAberto(true)}
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
                                        <span>Árvore selecionada</span>
                                        <strong>{arvoreEscolhida.nomePopular}</strong>
                                        <p>{arvoreEscolhida.descricao}</p>
                                        <small>{arvoreEscolhida.quantidade} disponíveis</small>
                                    </div>

                                    <button
                                        type="button"
                                        className="btnAlterarArvore"
                                        onClick={() => setModalArvoresAberto(true)}
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
                                name="arvoreId"
                                value={arvoreSelecionada ?? ""}
                            />

                            <div className="col-md-12 mt-2">
                                <div className="inputGroup">
                                    <label htmlFor="cidadeId">Árvore selecionada com base na cidade *</label>

                                    <select
                                        id="cidadeId"
                                        name="cidadeId"
                                        value={cidadeSelecionada}
                                        onChange={handleCidadeChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Selecione a cidade
                                        </option>

                                        {cidades.map(cidade => (
                                            <option key={cidade.id} value={cidade.id}>
                                                {cidade.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="formSection">
                            <div className="sectionTitle">
                                <span>2.</span><h3>Informações pessoais</h3>
                            </div>
                            <p className="sectionDescription">Informe os dados do solicitante.</p>

                            <div className="row g-3">
                                <div className="col-md-12">
                                    <div className="inputGroup">
                                        <label htmlFor="nomeBeneficiario">Nome</label>
                                        <input id="nomeBeneficiario" name="nomeBeneficiario" type="text" placeholder="Digite seu nome" required />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="inputGroup">
                                        <label htmlFor="telefoneBeneficiario">Telefone</label>
                                        <input id="telefoneBeneficiario" name="telefoneBeneficiario" type="text" placeholder="(11) 11111-1111" required />
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="inputGroup">
                                        <label>Deseja retirar no local ou agendar o plantio e deixar por nossa conta?</label>
                                        <div className="tipoSolicitacao d-flex align-items-center gap-3">
                                            <div className="d-flex align-items-center gap-1">
                                                <input type="radio" className="radio" id="retirar" name="tipoAtendimento" value="retirar" required />
                                                <label htmlFor="retirar">Retirar no local</label>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <input type="radio" className="radio" id="agendar" name="tipoAtendimento" value="agendar" />
                                                <label htmlFor="agendar">Agendar plantio</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="formSection">
                            <div className="sectionTitle">
                                <span>3.</span><h3>Endereço do local</h3>
                            </div>
                            <p className="sectionDescription">
                                Informe o endereço onde o plantio será realizado.
                            </p>

                            <div className="row g-3">
                                {[
                                    ["rua", "Rua / Avenida *", "Digite o nome da rua", "col-md-6"],
                                    ["numero", "Número *", "Nº", "col-md-2"],
                                    ["bairro", "Bairro *", "Digite o bairro", "col-md-4"],
                                    ["cep", "CEP *", "00000-000", "col-md-3"]
                                ].map(([id, label, placeholder, col]) => (
                                    <div className={col} key={id}>
                                        <div className="inputGroup">
                                            <label htmlFor={id}>{label}</label>
                                            <input id={id} name={id} type="text" placeholder={placeholder} required />
                                        </div>
                                    </div>
                                ))}

                                <div className="col-md-5">
                                    <div className="inputGroup">
                                        <label htmlFor="cidade">Cidade *</label>

                                        <input
                                            id="cidadeEndereco"
                                            name="cidadeEndereco"
                                            type="text"
                                            value={cidadeEscolhida?.nome ?? ""}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="inputGroup">
                                        <label htmlFor="estado">Estado *</label>
                                        <select id="estado" name="estado" required>
                                            <option value="" disabled>Selecione o estado</option>
                                            {estados.map(estado => (
                                                <option key={estado.sigla} value={estado.sigla}>
                                                    {estado.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="inputGroup">
                                        <label htmlFor="pontoReferencia">Ponto de referência (opcional)</label>
                                        <input
                                            id="pontoReferencia"
                                            name="pontoReferencia"
                                            type="text"
                                            placeholder="Ex: próximo ao ponto de ônibus..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="formSection">
                            <div className="sectionTitle">
                                <span>4.</span><h3>Comprovante de residência</h3>
                            </div>
                            <p className="sectionDescription">
                                Anexe um comprovante de residência atualizado.
                            </p>

                            <label htmlFor="comprovante" className="comprovanteUpload">
                                <strong>Selecionar comprovante</strong>
                                <span>(PDF, JPG ou PNG)</span>
                                <input
                                    id="comprovante"
                                    name="comprovante"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleComprovanteChange}
                                />
                            </label>

                            {comprovante && (
                                <div className="fileUploaded">
                                    <div className="fileIcon">
                                        <FontAwesomeIcon icon={faFileLines} />
                                    </div>
                                    <div className="fileInfo">
                                        <strong>{comprovante.name}</strong>
                                        <span>{(comprovante.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="deleteFile"
                                        onClick={() => setComprovante(null)}
                                        title="Remover arquivo"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btnEnviar">
                            <FontAwesomeIcon icon={faPaperPlane} /> Enviar requisição
                        </button>
                    </div>

                    <div className="statusColumn">
                        <div className="statusCard">
                            <div className="statusHeader">
                                <div>
                                    <h2>Acompanhe sua requisição</h2>
                                    <p>Protocolo: #SRP-2024-0056</p>
                                </div>
                                <span className="statusBadge">Em andamento</span>
                            </div>

                            <div className="timeline">
                                <div className="timelineItem active">
                                    <div className="timelineIcon"><FontAwesomeIcon icon={faCheck} /></div>
                                    <div className="timelineContent">
                                        <h3>Solicitado</h3>
                                        <p>Sua requisição foi recebida com sucesso.</p>
                                        <span>12/05/2024 às 10:32</span>
                                    </div>
                                </div>

                                <div className="timelineItem active">
                                    <div className="timelineIcon"><FontAwesomeIcon icon={faCheck} /></div>
                                    <div className="timelineContent">
                                        <h3>Aprovado</h3>
                                        <p>Sua requisição foi aprovada.</p>
                                        <span>14/05/2024 às 14:15</span>
                                    </div>
                                </div>

                                <div className="timelineItem current">
                                    <div className="timelineIcon"><FontAwesomeIcon icon={faClock} /></div>
                                    <div className="timelineContent">
                                        <h3>Aguardando retirada</h3>
                                        <p>Aguardamos a retirada de algum item que possa interferir no plantio.</p>
                                    </div>
                                </div>

                                <div className="timelineItem">
                                    <div className="timelineIcon"><FontAwesomeIcon icon={faCalendarCheck} /></div>
                                    <div className="timelineContent">
                                        <h3>Agendado para plantio</h3>
                                        <p>Em breve seu plantio será agendado.</p>
                                    </div>
                                </div>

                                <div className="timelineItem">
                                    <div className="timelineIcon"><FontAwesomeIcon icon={faLeaf} /></div>
                                    <div className="timelineContent">
                                        <h3>Concluído</h3>
                                        <p>Plantio realizado com sucesso!</p>
                                        <span>A foto será disponibilizada aqui.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="conclusaoBox">
                                <div>
                                    <strong>Após a conclusão</strong>
                                    <p>Uma foto da árvore poderá ser adicionada aqui após o plantio. Caso você tenha optado por retirar e plantar por conta própria, você mesmo poderá inserir a imagem.</p>
                                </div>
                                <div className="conclusaoIcon">
                                    <FontAwesomeIcon icon={faCamera} />
                                    <FontAwesomeIcon icon={faLeaf} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {modalArvoresAberto && (
                <div
                    className="arvoresModalOverlay"
                    onMouseDown={e => e.target === e.currentTarget && setModalArvoresAberto(false)}
                >
                    <div className="arvoresModal" role="dialog" aria-modal="true" aria-labelledby="tituloModalArvores">
                        <div className="arvoresModalHeader">
                            <div>
                                <h2 id="tituloModalArvores">Árvores disponíveis</h2>
                                <p>Escolha a espécie que deseja para o seu plantio.</p>
                            </div>
                            <button
                                type="button"
                                className="btnFecharModal"
                                onClick={() => setModalArvoresAberto(false)}
                                aria-label="Fechar modal"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className="arvoresModalBody">
                            <div className="arvoresGrid">
                                {arvores.map(arvore => {
                                    const selecionada = arvoreSelecionada === arvore.id;
                                    const disponivel = arvore.quantidade > 0;

                                    return (
                                        <article
                                            key={arvore.id}
                                            className={`arvoreCard ${selecionada ? "selected" : ""} ${!disponivel ? "indisponivelCard" : ""}`}
                                            onClick={() => disponivel && selecionarArvore(arvore.id)}
                                        >
                                            <div className="arvoreImagem">
                                                <img src={arvore.imagemUrl} alt={arvore.nome} />
                                            </div>

                                            <div className="arvoreCardContent">
                                                <div className="arvoreCardTitle">
                                                    <h3>{arvore.nomePopular}</h3>
                                                    <span className={disponivel ? "disponivel" : "indisponivel"}>
                                                        {disponivel ? `${arvore.quantidade} disponíveis` : "Indisponível"}
                                                    </span>
                                                </div>

                                                <p>{arvore.descricao}</p>

                                                <button
                                                    type="button"
                                                    disabled={!disponivel}
                                                    className="btnEscolherArvore"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        selecionarArvore(arvore.id);
                                                    }}
                                                >
                                                    {selecionada ? (
                                                        <><FontAwesomeIcon icon={faCheck} /> Árvore selecionada</>
                                                    ) : disponivel ? "Escolher esta árvore" : "Indisponível"}
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
        </SectionContent>
    );
};
