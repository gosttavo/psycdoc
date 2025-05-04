import { NavLink } from "react-router";
import LogoutButton from "./LogoutButton";

interface HeaderProps {
    isDarkMode: boolean;
}

export default function Header({ isDarkMode }: HeaderProps) {
    return (
        <header className={`w-full ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-slate-100 border-b border-slate-300'}`}>
            <div className="w-full p-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        PsycDoc
                    </h1>
                </div>
                <div className="flex items-center space-x-4 mr-4">
                    <span className={`inline-block h-8 w-8 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                        <NavLink to={'/profile'} >
                                <svg className={`h-full w-full ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                        </NavLink>
                    </span>
                    <LogoutButton isDarkMode={isDarkMode} />
                </div>
            </div>
        </header>
    )
}