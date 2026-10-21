import ModalForm from "../ModalForm/ModalForm";
import type { Requisicao } from "../../../types";

import "../ModalRequisicao/ModalRequisicao.css";
import { formatarData, formatarStatus } from "../../../utils/formatadores";
import { SkeletonTable } from "../Skeletons/SkeletonTable";

interface ModalRequisicaoProps {
    aberto: boolean;
    fechar: () => void;
    requisicoes?: Requisicao[];
    carregando?: boolean;
    onSelecionar?: (requisicao: Requisicao) => void;
}

export default function ModalRequisicaoPlantar({
    aberto,
    fechar,
    requisicoes = [],
    carregando,
    onSelecionar
}: ModalRequisicaoProps) {

    return (
        <ModalForm
            aberto={aberto}
            fechar={fechar}
            titulo="Minhas requisições"
            descricao="Acompanhe suas solicitações de plantio."
        >
            <div className="modalRequisicao">

                <section className="secaoRequisicao">

                    <div className="listaResultado">
                        {carregando ? (
                            <SkeletonTable linhas={4} />
                        ) : (
                            <table className="table tableRequisicao">

                                <thead>
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Árvore</th>
                                        <th scope="col">Data</th>
                                        <th scope="col">Status</th>
                                        <th
                                            scope="col"
                                            className="text-center"
                                        >
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {requisicoes.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="mensagemVazio"
                                            >
                                                Você ainda não possui
                                                requisições.
                                            </td>
                                        </tr>
                                    ) : (

                                        requisicoes.map((item) => (

                                            <tr key={item.id}>

                                                <td>
                                                    <strong>
                                                        {item.nomeBeneficiario ||
                                                            "Não informado"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {item.arvore?.nomePopular ||
                                                            "Não informado"}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatarData(item.criadoEm)}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`statusTag ${item.status.toLowerCase()}`}
                                                    >
                                                        {formatarStatus(
                                                            item.status
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="text-center">

                                                    <button
                                                        type="button"
                                                        className="btnVerificar"
                                                        onClick={() =>
                                                            onSelecionar?.(item)
                                                        }
                                                    >
                                                        Ver detalhes
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>
                            </table>
                        )}
                    </div>

                </section>

            </div>
        </ModalForm>
    );
}
