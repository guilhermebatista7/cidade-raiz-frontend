import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HomeVideo } from "../HomeVideo/HomeVideo";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { HomeContent } from "../HomeContent/HomeContent";
import { cardsInfo } from "../../dataInfo/cardsInfo";
import { CardInfo } from "../CardInfo/CardInfo";
import { CardSolution } from "../CardSolution/CardSolution";
import { solucao } from "../../dataInfo/solucao";

import treeVideo from '../../media/tree_video.mp4'
import notebook from '../../media/notebook.png'
import tree from '../../media/tree.png'
import './HomePage.css'

export function HomePage() {
  return (
    <>
      <HomeVideo
        src={treeVideo}
        fallbackSrc={tree}
        title="Cidade Raiz"
        icon={<FontAwesomeIcon icon={faLeaf} style={{ color: '#739d1e' }} />}
      />

      <section id="nosso-objetivo" className="sectionTitle"><h2>Nosso objetivo</h2></section>
      <HomeContent className="homeContent">
        {cardsInfo.map((card) => <CardInfo key={card.number} {...card} />)}
      </HomeContent>

      <HomeContent className="homeContent align-items-start">
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
      </HomeContent>

      <section className="sectionTitle"><h2>Nossa solução</h2></section>
      <HomeContent className="homeContent align-items-start">
        <CardSolution solutions={solucao} />
      </HomeContent>
    </>
  )
}