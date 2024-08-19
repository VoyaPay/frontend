import { useAuth } from '../context/AuthProvider';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  logout();
  return <></>
};

export default LogoutButton;
