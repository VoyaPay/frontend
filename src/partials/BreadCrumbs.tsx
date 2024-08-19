import { Link } from "react-router-dom";

export const BreadCrumbs: React.FC = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3 bg-light">
      <nav aria-label="breadcrumb" className='m-2' style={{height: "26px"}}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Dashboard
          </li>
        </ol>
      </nav>

      <div className="dropdown ms-auto">
        <button
          className="btn dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person"></i>{" "}
          {/* Bootstrap Icons: https://icons.getbootstrap.com */}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <Link className="dropdown-item" to="/profile">
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <Link className="dropdown-item" to="/logout">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
