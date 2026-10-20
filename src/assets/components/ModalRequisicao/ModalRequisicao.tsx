import ModalForm from "../ModalForm/ModalForm";
import type { Requisicao, StatusRequisicao } from "../../../types";

import "./ModalRequisicao.css";
import { useEffect, useState } from "react";
import { agendarPlantio, alterarStatus, recusarRequisicao } from "../../../services/requisicaoService";
import { formatarData, formatarDataAgendamento, formatarStatus, formatarTelefone, formatarTipoAtendimento } from "../../../utils/formatadores";

interface ModalRequisicaoProps {
    aberto: boolean;
    fechar: () => void;
    requisicao: Requisicao  | null;
    baseUrl: string;
    onAtualizado: () => Promise<void>;
}

export default function ModalRequisicao({
    aberto,
    fechar,
    requisicao,
    onAtualizado
}: ModalRequisicaoProps) {

    const [status, setStatus] = useState<StatusRequisicao>(
        requisicao?.status ?? "SOLICITADO"
    );
    const [obsStatus, setObsStatus] = useState("");
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    useEffect(() => {
        if (!requisicao) return;

        setStatus(requisicao.status);
        setObsStatus("");
        setDataInicial("");
        setDataFinal("");
    }, [requisicao]);

    if (!requisicao) {
        return null;
    }

    const fotoLocal = requisicao.fotoLocalUrl ?? null;
    const comprovanteResidencia = requisicao.comprovanteResidenciaUrl ?? null;

    const handleChangeStatus = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!requisicao) return;

        if (
            !status || (!obsStatus && status === 'RECUSADO') ||
            ((!dataInicial || !dataFinal) && status === 'AGENDADO_PLANTIO')
        ) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {

            if (status === 'RECUSADO') {
                await recusarRequisicao(requisicao.id, obsStatus);
                await onAtualizado();
                fechar();
                return;
            }

            if (status === 'AGENDADO_PLANTIO') {
                await agendarPlantio(requisicao.id, new Date(`${dataInicial}`), new Date(`${dataFinal}`));
                await onAtualizado();
                fechar();
                return;
            }

            await alterarStatus(requisicao.id, status);
            await onAtualizado();
            fechar();

        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    }

    return (
        <ModalForm
            aberto={aberto}
            fechar={fechar}
            titulo="Detalhes da requisição"
            descricao={`Requisição #${requisicao.id.substring(0, 8)}`}
        >
            <div className="modalRequisicao">
                <form className="formSection" onSubmit={handleChangeStatus}>

                    {/* RESUMO */}
                    <section className="secaoRequisicao">
                        <h3>Resumo da requisição</h3>

                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <div className="select d-flex flex-column">
                                <span>Situação</span>
                                <select name="requisicaoStatus" id="requisicaoStatus" value={status} onChange={(e) => setStatus(e.target.value as StatusRequisicao)}>
                                    <option value="SOLICITADO">Solicitado</option>
                                    <option value="APROVADO">Aprovado</option>
                                    <option value="RECUSADO">Recusado</option>
                                    {requisicao.tipoAtendimento === "RETIRADA_LOCAL" && (
                                        <option value="AGUARDANDO_RETIRADA">Aguardando retirada</option>
                                    )}
                                    {requisicao.tipoAtendimento === "PLANTIO_AGENDADO" && (
                                        <option value="AGENDADO_PLANTIO">Plantio agendado</option>
                                    )}
                                    <option value="CONCLUIDO">Concluído</option>
                                </select>
                            </div>

                            {(status !== requisicao.status && status === 'RECUSADO') ? (
                                <input value={obsStatus} className="w-50 mt-3" type="text" placeholder="Informe o motivo" onChange={(e) => setObsStatus(e.target.value)} />
                            ) : ''}
                            {(status !== requisicao.status && status === 'AGENDADO_PLANTIO') ? (
                                <>

                                    <div className="d-flex flex-column">
                                        <span>Data inicial (estimada)</span>
                                        <input className="w-auto dataInicial " type="date" value={dataInicial} onChange={(e) => (setDataInicial(e.target.value))} />
                                    </div>

                                    <div className="d-flex flex-column">
                                        <span>Data final (estimada)</span>
                                        <input className="w-auto dataFinal " type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                                    </div>
                                </>
                            ) : ''}
                            {status !== requisicao.status ? (
                                <button type="submit" className={`btnRequisicao w-auto mt-3`}>Salvar</button>
                            ) : ''}
                        </div>

                        <div className="gridInformacoes">

                            <div className="informacao">
                                <span>Beneficiário</span>
                                <strong>
                                    {requisicao.nomeBeneficiario ||
                                        "Não informado"}
                                </strong>
                            </div>

                            <div className="informacao">
                                <span>Telefone</span>
                                <strong>
                                    {formatarTelefone(
                                        requisicao.telefoneBeneficiario
                                    )}
                                </strong>
                            </div>

                            <div className="informacao">
                                <span>Árvore</span>
                                <strong>
                                    {requisicao.arvore?.nomePopular ||
                                        "Não informado"}
                                </strong>
                            </div>

                            <div className="informacao">
                                <span>Tipo de atendimento</span>
                                <strong>
                                    {formatarTipoAtendimento(
                                        requisicao.tipoAtendimento
                                    )}
                                </strong>
                            </div>

                            <div className="informacao">
                                <span>Status</span>

                                <span
                                    className={`statusModal status-${requisicao.status.toLowerCase()}`}
                                >
                                    {formatarStatus(requisicao.status)}
                                </span>
                            </div>

                            <div className="informacao">
                                <span>Data da solicitação</span>
                                <strong>
                                    {formatarData(requisicao.criadoEm)}
                                </strong>
                            </div>

                            {requisicao.status === 'AGENDADO_PLANTIO' ?
                                <>

                                    <div className="informacao">
                                        <span>Data inicial (estimada)</span>
                                        <strong>
                                            {formatarDataAgendamento(requisicao.dataInicial)}
                                        </strong>
                                    </div>

                                    <div className="informacao">
                                        <span>Data final (estimada)</span>
                                        <strong>
                                            {formatarDataAgendamento(requisicao.dataFinal)}
                                        </strong>
                                    </div>
                                </>
                                : ''
                            }

                            {requisicao.status === 'RECUSADO' ?
                                <>

                                    <div className="informacao">
                                        <span>Motivo recusado</span>
                                        <strong>
                                            {requisicao.observacaoStatus}
                                        </strong>
                                    </div>

                                </>
                                : ''
                            }

                        </div>
                    </section>
                </form>

                {/* ENDEREÇO */}
                <section className="secaoRequisicao">
                    <h3>Local da solicitação</h3>

                    <div className="enderecoRequisicao">
                        <strong>
                            {requisicao.rua}, {requisicao.numero}
                        </strong>

                        <span>
                            {requisicao.bairro} -{" "}
                            {requisicao.cidadeEndereco} /{" "}
                            {requisicao.estado}
                        </span>

                        <span>
                            CEP: {requisicao.cep}
                        </span>

                        {requisicao.pontoReferencia && (
                            <span>
                                <strong>Ponto de referência:</strong>{" "}
                                {requisicao.pontoReferencia}
                            </span>
                        )}
                    </div>
                </section>

                {/* DOCUMENTOS E FOTOS */}
                <section className="secaoRequisicao">
                    <h3>Documentos e fotos</h3>

                    <div className="documentosRequisicao">

                        {/* FOTO DO LOCAL */}
                        <div className="documentoCard">
                            <h4>Foto do local</h4>

                            {fotoLocal ? (
                                <a
                                    href={fotoLocal}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={fotoLocal}
                                        alt="Foto do local da solicitação"
                                        className="fotoRequisicao"
                                    />
                                </a>
                            ) : (
                                <div className="arquivoIndisponivel">
                                    Foto não disponível
                                </div>
                            )}
                        </div>

                        {/* COMPROVANTE */}
                        <div className="documentoCard">
                            <h4>Comprovante de residência</h4>

                            {comprovanteResidencia ? (
                                <div className="comprovanteContainer">

                                    <div className="iconeDocumento">
                                        PDF
                                    </div>

                                    <a
                                        href={comprovanteResidencia}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btnRequisicao"
                                    >
                                        Visualizar comprovante
                                    </a>

                                </div>
                            ) : (
                                <div className="arquivoIndisponivel">
                                    Comprovante não disponível
                                </div>
                            )}
                        </div>

                    </div>
                </section>

            </div>
        </ModalForm>
    );
}
