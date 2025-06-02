import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface LogoutButtonProps {
    isDarkMode: boolean;
};

export default function LogoutButton({ isDarkMode }: LogoutButtonProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
    <button
        className={`p-1 cursor-pointer rounded-md ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-200 text-slate-500'}`}
        onClick={handleLogout}
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    </button>
    );
}