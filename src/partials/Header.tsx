import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function Header() {
  const { t, i18n } = useTranslation();

  const setLanguage = (lang: 'en' | 'zh') => {
    console.log(lang);
    i18n.changeLanguage(lang);
  };

  // i18n.changeLanguage('zh');

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top w-100">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Voyapay
        </Link>
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavId"
          aria-controls="collapsibleNavId"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavId">
          <ul className="navbar-nav me-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/my-account" aria-current="page">
                {t("my_account")}
                <span className="visually-hidden">(current)</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cards">
                {t("shared_card")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transactions">
                {t("transactions")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/qa">
                {t("Q&A")}
              </Link>
            </li>
          </ul>
          <span className="nav-item dropdown">
            <div className="dropdown">
              <a
                className="btn btn-sm dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >Settings <span className=' bi bi-person-circle'/></a>

              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#" onClick={() =>setLanguage('zh')}>
                    Chinese
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={() =>setLanguage('en')}>
                    English
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Header;
