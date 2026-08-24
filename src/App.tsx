import './App.css'
import { HomeVideo } from './assets/components/HomeVideo/HomeVideo'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBolt, faDroplet, faLeaf, faSeedling, faWind, } from '@fortawesome/free-solid-svg-icons';

import tree from '../src/assets/media/tree.png';
import imgLogo from '../src/assets/media/imgLogo.png';
import tree_video from '../src/assets/media/tree_video.mp4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Menu } from './assets/components/Menu/Menu';
import { HomeContent } from './assets/components/HomeContent/HomeContent';
import { CardInfo } from './assets/components/CardInfo/CardInfo';



function App() {

  return (
    <>
      <Menu />
      <HomeVideo
        src={tree_video}
        fallbackSrc={tree}
        title='Cidade Raiz'
        icon={
          <FontAwesomeIcon
            icon={faLeaf}
            style={{ color: '#739d1e' }}
          />
        }
      />

      <HomeContent className='homeContent'>

        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faDroplet}
            />
          }
          number={'01'}
          title='Água'
          text='As árvores desempenham um papel importante na retenção de parte da água da chuva e na redução do escoamento superficial. Esse processo ajuda a minimizar os impactos de chuvas intensas nas cidades.'
        />

        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faBolt}
            />
          }
          number={'03'}
          title='Energia Limpa'
          text='O sombreamento e o processo de transpiração das árvores ajudam a reduzir a temperatura e o efeito de ilha de calor urbano. A sombra proporcionada pelas ruas arborizadas pode reduzir a demanda e a necessidade de ar-condicionado em edifícios.'
        />

        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faSeedling}
            />
          }
          number={'02'}
          title='Biodiversidade'
          text='A arborização tem o potencial de tornar as cidades mais amigáveis ao disponibilizar recursos que auxiliam no restabelecimento da fauna na matriz urbana.'
        />


        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faWind}
            />
          }
          number={'03'}
          title='Ar Puro'
          text='As árvores urbanas são aliadas na luta contra a poluição, atuando na absorção de poluentes como monóxido de carbono e dióxido de enxofre. Quando bem planejada, a arborização ajuda a melhorar a qualidade do ar nas cidades.'
        />
      </HomeContent>

      <div className='sectionTitle'>
        <h2>- Nossa solução</h2>
      </div>

      <HomeContent className='homeContent'>

        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faDroplet}
            />
          }
          number={'01'}
          title='Água'
          text='As árvores desempenham um papel importante na retenção de parte da água da chuva e na redução do escoamento superficial. Esse processo ajuda a minimizar os impactos de chuvas intensas nas cidades.'
        />

        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faBolt}
            />
          }
          number={'03'}
          title='Energia Limpa'
          text='O sombreamento e o processo de transpiração das árvores ajudam a reduzir a temperatura e o efeito de ilha de calor urbano. A sombra proporcionada pelas ruas arborizadas pode reduzir a demanda e a necessidade de ar-condicionado em edifícios.'
        />

        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faSeedling}
            />
          }
          number={'02'}
          title='Biodiversidade'
          text='A arborização tem o potencial de tornar as cidades mais amigáveis ao disponibilizar recursos que auxiliam no restabelecimento da fauna na matriz urbana.'
        />


        <CardInfo
          icon={
            <FontAwesomeIcon
              icon={faWind}
            />
          }
          number={'03'}
          title='Ar Puro'
          text='As árvores urbanas são aliadas na luta contra a poluição, atuando na absorção de poluentes como monóxido de carbono e dióxido de enxofre. Quando bem planejada, a arborização ajuda a melhorar a qualidade do ar nas cidades.'
        />
      </HomeContent>

      <div className="imgLogo">
        <img src={imgLogo} alt="Logo Cidade Raíz" />
      </div>

    </>
  )
}

export default App
