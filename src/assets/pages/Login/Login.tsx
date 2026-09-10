import React, { useState } from 'react';
import './Login.css';
import loginTree from '../../media/login_tree.webm'
import { cadastrar, login } from '../../../services/authService';
import Alert from '../../components/Alert/Alert';

export function Login() {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaRepet, setSenhaRepet] = useState('');

  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
  } | null>(null);


  const showAlert = (
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info' = 'danger'
  ) => {
    setAlert({
      message,
      type,
    });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleGoToLogin = () => {
    closeAlert();

    setNome('');
    setEmail('');
    setSenha('');
    setSenhaRepet('');

    setRightPanelActive(false);
  };

  const handleGoToRegister = () => {
    closeAlert();

    setNome('');
    setEmail('');
    setSenha('');
    setSenhaRepet('');

    setRightPanelActive(true);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (senha.length < 6) {
      showAlert(
        'A senha deve ter pelo menos 6 caracteres.',
        'danger'
      )
      return;
    }

    if(senha !== senhaRepet){
      showAlert(
        'Senhas diferentes',
        'danger'
      )
      return;
    }

    try {
      const resultado = await cadastrar(nome, email, senha);

      setNome('');
      setEmail('');
      setSenha('');
      setRightPanelActive(false);
      showAlert(
        'Conta cadastrada com sucesso',
        'success'
      );

      console.log(resultado);
    } catch (error) {
      showAlert(
        `${error}`,
        'danger'
      );

      console.error(error);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      const autenticado = await login(email, senha);
      setEmail('');
      setSenha('');
      showAlert(
        'Login efetuado com sucesso!',
        'success'
      );
      console.log(autenticado);
    } catch (error) {
      showAlert(
        'E-mail ou senha incorretos.',
        'danger'
      );
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

            <input
              type="text"
              placeholder="Nome"
              value={nome}
              required
              onChange={(e) => {
                setNome(e.target.value);
              }}
            />

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
              placeholder="Senha (mín. 6 caracteres)"
              value={senha}
              required
              onChange={(e) =>
                setSenha(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Repita sua senha"
              value={senhaRepet}
              required
              onChange={(e) =>
                setSenhaRepet(e.target.value)
              }
            />

            {alert && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={closeAlert}
              />
            )}

            <button type="submit" className='btnDefault'>
              Criar conta
            </button>
          </form>

        </div>


        {/* LOGIN */}
        <div className="formContainer signInContainer">
          <form onSubmit={handleLogin}>
            <h1>Entrar</h1>

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
              onChange={(e) => {
                setSenha(e.target.value)
              }}
            />

            {alert && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={closeAlert}
              />
            )}

            <a href="#">
              Esqueceu sua senha?
            </a>

            <button type="submit" className='btnDefault'>
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
                className="ghost btnDefault"
                onClick={() => handleGoToLogin()}
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
                className="ghost btnDefault"
                onClick={() => handleGoToRegister()}
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