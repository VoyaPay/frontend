// src/context/AuthProvider.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, logoutApi, getToken } from "../api/auth"; // Assuming these functions are defined in your API service

interface AuthContextType {
  token: string | undefined;
  login: (
    credentials: LoginCredentials,
    onSuccess?: () => void
  ) => Promise<void>;
  logout: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode}> = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (
    credentials: LoginCredentials,
    onSuccess?: () => void
  ) => {
    const response = await loginApi(credentials);
    if (response.access_token) {
      setToken(response.access_token);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const logout = () => {
    setToken(undefined);
    localStorage.removeItem("authToken");
    logoutApi();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
