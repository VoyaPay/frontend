import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { validateEmail } from "../utils/validations";

interface LoginCredentials {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(credentials.email)) {
      setError("Please enter a valid email");
      return;
    }
    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await login(credentials, () => {
        navigate("/");
      });
    } catch (error) {
      // console.log(error);
      setError("Invalid E-mail or password. Please try again...");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="text-center mt-4">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "200px" }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mt-5 p-4">
            <h2>轮播图：营销活动/产品卖点/品牌介绍</h2>
            <p>（如首充最高返99刀手续费全免）</p>
            <button className="btn btn-primary">查看详情</button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="form-control"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    minLength={6}
                    required
                    className="form-control"
                    autoComplete="on"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar navbar-expand-sm fixed-bottom" id="footer">
        <div className="container-fluid">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                公司名称
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                备案号
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                支付业务服务条款
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                商户入驻服务条款
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                隐私政策
                </a>
              </li>
            </ul>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
