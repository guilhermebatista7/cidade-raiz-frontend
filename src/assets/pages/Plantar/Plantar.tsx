import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SectionContent } from "../../components/SectionContent/SectionContent"

import './Plantar.css';
import { faChevronRight, faCircleCheck, faClipboard, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";
import { faSistrix } from "@fortawesome/free-brands-svg-icons";

export const Plantar = () => {
    return (
        <>
            <SectionContent className='sectionPlantar'>
                <div className="container-fluid solicitacao">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="status d-flex align-items-center justify-content-around">
                            <div className="iconStatus checked">
                                <FontAwesomeIcon icon={faClipboard} />
                                <span>Solicitação</span>
                            </div>
                            <div className="iconStatus seta">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className="iconStatus">
                                <FontAwesomeIcon icon={faSistrix} />
                                <span>Em análise</span>
                            </div>
                            <div className="iconStatus seta">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className="iconStatus">
                                <FontAwesomeIcon icon={faHourglassHalf} />
                                <span>Aguardando Retirada </span>
                            </div>
                            <div className="iconStatus seta">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                            <div className="iconStatus">
                                <FontAwesomeIcon icon={faCircleCheck} />
                                <span>Concluído</span>
                            </div>
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className="row">
                            <div className='col-4'>
                                <label htmlFor="nome">Nome</label>
                                <input type="text" className="form-control" id="nome" placeholder="Digite o nome" />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="telefone">Telefone</label>
                                <input type="text" className="form-control" id="telefone" placeholder="Digite o telefone" />
                            </div>
                            <div className='col-4'>
                                <label htmlFor="cpfCnpj">CPF/CNPJ</label>
                                <input type="text" className="form-control" id="cpfCnpj" placeholder="Digite o CPF/CNPJ" />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContent>
        </>
    )
}