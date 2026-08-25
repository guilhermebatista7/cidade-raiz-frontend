import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from "react-router-dom";

import "./Menu.css";

export function Menu() {
  const { hash, pathname } = useLocation();
  const menuLinkClass = (isActive: boolean, additionalClass = "") =>
    `nav-link nature-link ${additionalClass} ${isActive ? "active" : ""}`.trim();

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
              <NavLink
                className={() => menuLinkClass(pathname === "/" && !hash, "home-link")}
                to="/"
                aria-label="Home"
              >
                <FontAwesomeIcon icon={faHouse} />
              </NavLink>
            </li>

            {/* Blog */}
            <li className="nav-item">
              <NavLink className={({ isActive }) => menuLinkClass(isActive)} to="/blog">
                Blog
              </NavLink>
            </li>

            {/* Sobre */}
            <li className="nav-item">
              <NavLink
                className={() => menuLinkClass(pathname === "/" && hash === "#nosso-objetivo")}
                to="/#nosso-objetivo"
              >
                Sobre
              </NavLink>
            </li>

            {/* Plantar */}
            <li className="nav-item">
              <NavLink className={({ isActive }) => menuLinkClass(isActive)} to="/plantar">
                Plantar
              </NavLink>
            </li>

            {/* Login */}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => menuLinkClass(isActive, "nature-login")}
                to="/login"
              >
                Login
              </NavLink>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}
