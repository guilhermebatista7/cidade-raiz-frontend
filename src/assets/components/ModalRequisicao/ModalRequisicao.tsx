import ModalForm from "../ModalForm/ModalForm";
import type { Arvore } from "../../../types";

import "./ModalRequisicao.css";
import { useEffect, useState } from "react";

interface RequisicaoModal {
    id: string;
    nomeBeneficiario: string | null;
    telefoneBeneficiario: string | null;

    status: string;
    tipoAtendimento: string;

    rua: string;
    numero: string;
    bairro: string;
    cidadeEndereco: string;
    cep: string;
    estado: string;
    pontoReferencia: string;

    fotoLocalUrl: string | null;
    comprovanteResidenciaUrl: string | null;

    criadoEm: string;

    arvore: Arvore;
}

interface ModalRequisicaoProps {
    aberto: boolean;
    fechar: () => void;
    requisicao: RequisicaoModal | null;
    baseUrl: string;
}

const formatarData = (data: string) => {
    return new Date(data).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
};

const formatarTelefone = (telefone: string | null) => {
    if (!telefone) return "Não informado";

    const numeros = telefone.replace(/\D/g, "");

    if (numeros.length === 10) {
        return numeros.replace(
            /^(\d{2})(\d{4})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    if (numeros.length === 11) {
        return numeros.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    return telefone;
};

const formatarTipoAtendimento = (tipo: string) => {
    switch (tipo) {
        case "PLANTIO_AGENDADO":
            return "Plantio agendado";

        case "RETIRADA_LOCAL":
            return "Retirada no local";

        default:
            return tipo.replaceAll("_", " ");
    }
};

const formatarStatus = (status: string) => {
    switch (status) {
        case "SOLICITADO":
            return "Solicitado";

        case "APROVADO":
            return "Aprovado";

        case "RECUSADO":
            return "Recusado";

        case "CONCLUIDO":
            return "Concluído";

        case "AGUARDANDO_RETIRADA":
            return "Aguardando retirada";

        case "AGENDADO_PLANTIO":
            return "Plantio agendado";

        default:
            return status;
    }
};

export default function ModalRequisicao({
    aberto,
    fechar,
    requisicao,
}: ModalRequisicaoProps) {

    if (!requisicao) {
        return null;
    }

    const fotoLocal = requisicao.fotoLocalUrl
        ? requisicao.fotoLocalUrl
        : null;

    const comprovanteResidencia = requisicao.comprovanteResidenciaUrl
        ? requisicao.comprovanteResidenciaUrl
        : null;

    const [status, setStatus] = useState(requisicao?.status ?? "");

    useEffect(() => {
        if (requisicao) {
            setStatus(requisicao.status);
        }
    }, [requisicao]);

    return (
        <ModalForm
            aberto={aberto}
            fechar={fechar}
            titulo="Detalhes da requisição"
            descricao={`Requisição #${requisicao.id.substring(0, 8)}`}
        >
            <div className="modalRequisicao">

                {/* RESUMO */}
                <section className="secaoRequisicao">
                    <div className="d-flex align-items-center gap-3">
                        <h3>Resumo da requisição</h3>
                        <select name="requisicaoStatus" id="requisicaoStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="SOLICITADO">Solicitado</option>
                            <option value="APROVADO">Aprovado</option>
                            <option value="RECUSADO">Recusado</option>
                            <option value="AGUARDANDO_RETIRADA">Aguardando retirada</option>
                            <option value="AGENDADO_PLANTIO">Plantio agendado</option>
                            <option value="CONCLUIDO">Concluído</option>
                        </select>
                        {status !== requisicao.status ? (
                            <button className="btnRequisicao">Salvar</button>
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

                    </div>
                </section>

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
