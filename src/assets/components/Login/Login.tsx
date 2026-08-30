import { useState } from 'react';
import './Login.css';
import loginTree from '../../media/login_tree.webm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export function Login() {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  return (
    <div className="login-page">

      <div
        className={`login-container ${rightPanelActive ? 'right-panel-active' : ''
          }`}
        id="container"
      >

        {/* CADASTRO */}
        <div className="form-container sign-up-container">


          <form>
            <h1>Criar conta</h1>

            <div className="social-container">
              <a href="#" className="social" title='Google'>
                <FontAwesomeIcon icon={faGoogle} style={{color: '#4285F4'}}/>
              </a>
            </div>

            <span>ou utilize seu e-mail para cadastro</span>

            <input
              type="text"
              placeholder="Nome"
              required
            />

            <input
              type="email"
              placeholder="E-mail"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              required
            />

            <button type="submit">
              Criar conta
            </button>
          </form>

        </div>


        {/* LOGIN */}
        <div className="form-container sign-in-container">
          <form>
            <h1>Entrar</h1>

            <div className="social-container">

              <a href="#" className="social" title='Google'>
                <FontAwesomeIcon icon={faGoogle} style={{color: '#4285F4'}}/>
              </a>

            </div>

            <span>ou utilize sua conta</span>

            <input
              type="email"
              placeholder="E-mail"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              required
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
        <div className="overlay-container">

          <div className="overlay">

            {/* PAINEL ESQUERDO */}
            <div className="overlay-panel overlay-left">

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
            <div className="overlay-panel overlay-right">

              <h1>Olá, cidadão!</h1>

              <video src={loginTree} preload="auto" autoPlay loop muted/>

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
      <div className="login-footer">

        <b>Conecte-se conosco</b>

        <div className="footer-icons">

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