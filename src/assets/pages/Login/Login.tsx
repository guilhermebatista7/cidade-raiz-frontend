import React, { useState } from 'react';
import './Login.css';
import loginTree from '../../media/login_tree.webm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { cadastrar, login } from '../../../services/authService';

export function Login() {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      const resultado = await cadastrar(email, senha);
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogin(event: React.FormEvent){
    event.preventDefault();

    try {
      const autenticado = await login(email, senha);
      console.log(autenticado);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="loginPage">

      <div
        className={`loginContainer ${rightPanelActive ? 'rightPanelActive' : ''
          }`}
        id="container"
      >

        {/* CADASTRO */}
        <div className="formContainer signUpContainer">


          <form onSubmit={handleSubmit}>
            <h1>Criar conta</h1>

            <div className="socialContainer">
              <a href="#" className="social" title='Google'>
                <FontAwesomeIcon icon={faGoogle} style={{ color: '#4285F4' }} />
              </a>
            </div>

            <span>ou utilize seu e-mail para cadastro</span>

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              required
              onChange={(e) =>
                setSenha(e.target.value)
              }
            />

            <button type="submit">
              Criar conta
            </button>
          </form>

        </div>


        {/* LOGIN */}
        <div className="formContainer signInContainer">
          <form onSubmit={handleLogin}>
            <h1>Entrar</h1>

            <div className="socialContainer">

              <a href="#" className="social" title='Google'>
                <FontAwesomeIcon icon={faGoogle} style={{ color: '#4285F4' }} />
              </a>

            </div>

            <span>ou utilize sua conta</span>

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              required
              onChange={(e)=>{
                setEmail(e.target.value);
              }}
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              required
              onChange={(e)=>{
                setSenha(e.target.value)
              }}
            />

            <a href="#">
              Esqueceu sua senha?
            </a>

            <button type="submit">
              Entrar
            </button>
          </form>
        </div>


        {/* OVERLAY */}
        <div className="overlayContainer">

          <div className="overlay">

            {/* PAINEL ESQUERDO */}
            <div className="overlayPanel overlayLeft">

              <h1>Bem-vindo de volta!</h1>

              <video src={loginTree} preload="auto" autoPlay loop muted />

              <p>
                Já possui uma conta?
              </p>

              <button
                type="button"
                className="ghost"
                onClick={() => setRightPanelActive(false)}
              >
                Entrar
              </button>

            </div>


            {/* PAINEL DIREITO */}
            <div className="overlayPanel overlayRight">

              <h1>Olá, cidadão!</h1>

              <video src={loginTree} preload="auto" autoPlay loop muted />

              <p>
                Não possui cadastro?
              </p>

              <button
                type="button"
                className="ghost"
                onClick={() => setRightPanelActive(true)}
              >
                Criar conta
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* FOOTER */}
      <div className="loginFooter">

        <b>Conecte-se conosco</b>

        <div className="footerIcons">

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="social"
          >
            <i className="fab fa-github"></i>
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="social"
          >
            <i className="fab fa-instagram"></i>
          </a>

          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="social"
          >
            <i className="fab fa-linkedin"></i>
          </a>

        </div>

      </div>

    </div>
  );
}