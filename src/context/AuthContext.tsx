// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { clearAuth, getUserData } from '../utils/storage';
import { ROLES } from '../config/roleConfig';

interface AuthContextType {
  user: any | null;
  roleId: string;
  //   roleKey: RoleKey | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const roleId = (
    user?.RoleOpId ||
    user?.OperationalRole?.RoleId ||
    '0'
  ).toString();
  const roleKey = roleId in ROLES ? roleId : null;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUserData();
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    await clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, roleId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
