import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";
import { User } from "../interfaces/User";
import { useGetLoggedUser } from "../hooks/useLogin";
import { useNavigate } from "react-router";
  
interface AuthContextType {
    user: User | null;
    login: (userData: {
        isLoggedIn: boolean;
        userId: number;
    }) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { mutateAsync } = useGetLoggedUser();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (userData: {
        isLoggedIn: boolean,
        userId: number
    }) => {
        const user: Promise<User> = mutateAsync(userData.userId)

        if (!user) {
            console.error("User not found");
            logout();
            return;
        }
        
        setUser(await user);
        localStorage.setItem("user", JSON.stringify(userData));
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

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
  