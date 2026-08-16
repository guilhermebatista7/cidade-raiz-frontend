import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

import "./Menu.css";

export function Menu() {
  return (
    <nav className="navbar navbar-expand-md nature-navbar">
      <div className="container-fluid">

        {/* Botão hamburger no mobile */}
        <button
          className="navbar-toggler nature-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Abrir menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2">

            {/* Home */}
            <li className="nav-item">
              <a
                className="nav-link nature-link home-link"
                href="#"
                aria-label="Home"
              >
                <FontAwesomeIcon icon={faHouse} />
              </a>
            </li>

            {/* Blog */}
            <li className="nav-item">
              <a className="nav-link nature-link" href="#">
                Blog
              </a>
            </li>

            {/* Sobre */}
            <li className="nav-item">
              <a className="nav-link nature-link" href="#">
                Sobre
              </a>
            </li>

            {/* Login */}
            <li className="nav-item">
              <a className="nav-link nature-login" href="#">
                Login
              </a>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}
