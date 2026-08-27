import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import tree from './assets/media/tree.png'
import imgLogo from './assets/media/imgLogo.png'
import treeVideo from './assets/media/tree_video.mp4'
import notebook from './assets/media/notebook.png'
import { cardsInfo } from './assets/dataInfo/cardsInfo'
import { solucao } from './assets/dataInfo/solucao'
import { CardInfo } from './assets/components/CardInfo/CardInfo'
import { CardSolution } from './assets/components/CardSolution/CardSolution'
import { Footer } from './assets/components/Footer/Footer'
import { HomeContent } from './assets/components/HomeContent/HomeContent'
import { HomeVideo } from './assets/components/HomeVideo/HomeVideo'
import { Menu } from './assets/components/Menu/Menu'

function HomePage() {
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
        <div className='cardBack'>
          <div className='cardSistema d-flex flex-lg-row flex-column align-items-center justify-content-center gap-2'>
            <div className="notebook"><img src={notebook} alt="Imagem notebook" /></div>
            <div>
              <h3 className='mb-3'>O Sistema</h3>
              <p>
                O Cidade Raíz é uma plataforma que conecta moradores e Prefeitura para tornar o processo de plantio de árvores urbanas mais simples, acessível e transparente. Por meio do sistema, o cidadão pode conhecer as espécies disponíveis, solicitar uma muda, acompanhar o andamento do plantio e participar de um ranking de sustentabilidade. Assim, tecnologia e participação comunitária se unem para transformar nossas cidades em lugares mais verdes e sustentáveis.
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

function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [hash, pathname])

  return null
}

interface PageProps {
  title: string
  description: string
}

function Page({ title, description }: PageProps) {
  return (
    <main className="internal-page">
      <h1>{title}</h1>
      <p>{description}</p>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Menu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Page title="Blog" description="Em breve, conteúdos sobre cidades mais verdes." />} />
        <Route path="/login" element={<Page title="Login" description="A área de acesso estará disponível aqui." />} />
        <Route path="/plantar" element={<Page title="Quero plantar uma árvore" description="Em breve você poderá iniciar seu plantio por aqui." />} />
        <Route path="*" element={<Page title="Página não encontrada" description="O endereço acessado não existe." />} />
      </Routes>
      <Footer>
        <div className="imgLogo"><img src={imgLogo} alt="Logo Cidade Raiz" /></div>
      </Footer>
    </BrowserRouter>
  )
}

export default App
