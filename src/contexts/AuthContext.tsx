import {
    createContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { User } from "../interfaces/User";
import { useNavigate } from "react-router";
import AuthService from "../api/services/AuthService/service";
import { AuthLoginResponse } from "../interfaces/Auth";
import { useToast } from "./ToastContext";
  
interface AuthContextType {
    user: User | null;
    login: (userData: AuthLoginResponse) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (userData: AuthLoginResponse) => {
        try {
            const user = await AuthService.getUser(userData.data.id);
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            navigate('/');
            showToast(
                `Bem-vindo(a), ${user.name}!`,
                'success'
            );
        } catch (err) {
            console.error("Failed to fetch user", err);
            logout();
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isAuthenticated = !!user;

    useEffect(() => {
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
  