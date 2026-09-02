import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HeaderVideo } from "../../components/HeaderVideo/HeaderVideo";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { SectionContent } from "../../components/SectionContent/SectionContent";
import { cardsInfo } from "../../dataInfo/cardsInfo";
import { CardInfo } from "../../components/CardInfo/CardInfo";
import { CardSolution } from "../../components/CardSolution/CardSolution";
import { solucao } from "../../dataInfo/solucao";

import treeVideo from '../../media/tree_video.mp4'
import notebook from '../../media/notebook.png'
import './HomePage.css'

export function HomePage() {
  return (
    <>
      <HeaderVideo
        src={treeVideo}
        title="Cidade Raiz"
        icon={<FontAwesomeIcon icon={faLeaf} style={{ color: '#739d1e' }} />}
      />

      <section id="nossoObjetivo" className="sectionTitle"><h2>Nosso objetivo</h2></section>
      <SectionContent className="homeContent">
        {cardsInfo.map((card) => <CardInfo key={card.number} {...card} />)}
      </SectionContent>

      <SectionContent className="homeContent align-items-start">
        <div className="cardBack">
          <div className="cardSistema ">

            <div className="notebook">
              <img src={notebook} alt="Imagem notebook" />
            </div>

            <div className="cardSistemaText">
              <h3 className="mb-3">O Sistema</h3>

              <p>
                O Cidade Raíz é uma plataforma que conecta moradores e Prefeitura
                para tornar o processo de plantio de árvores urbanas mais simples,
                acessível e transparente. Por meio do sistema, o cidadão pode
                conhecer as espécies disponíveis, solicitar uma muda, acompanhar
                o andamento do plantio e participar de um ranking de sustentabilidade.
                Assim, tecnologia e participação comunitária se unem para transformar
                nossas cidades em lugares mais verdes e sustentáveis.
              </p>
            </div>

          </div>
        </div>
      </SectionContent>

      <section className="sectionTitle"><h2>Nossa solução</h2></section>
      <SectionContent className="homeContent align-items-start">
        <CardSolution solutions={solucao} />
      </SectionContent>
    </>
  )
}