import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import imgLogo from './assets/media/imgLogo.png'
import { Footer } from './assets/components/Footer/Footer'
import { Menu } from './assets/components/Menu/Menu'
import { HomePage } from './assets/pages/HomePage/HomePage'
import { Login } from './assets/pages/Login/Login'
import { BlogPage } from './assets/pages/BlogPage/BlogPage'
import { Plantar } from './assets/pages/Plantar/Plantar'

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
    <main className="internalPage">
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
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/plantar" element={<Plantar />} />
        <Route path="/gestao" element={<Page title="Gestão" description="Página de gestão." />} />
        <Route path="*" element={<Page title="Página não encontrada" description="O endereço acessado não existe." />} />
      </Routes>
      <Footer>
        <div className="imgLogo"><img src={imgLogo} alt="Logo Cidade Raiz" /></div>
      </Footer>
    </BrowserRouter>
  )
}

export default App
