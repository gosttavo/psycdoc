import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useDarkMode } from "../hooks/useDarkMode";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <div className="flex h-screen">
            <Sidebar isDarkMode={isDarkMode} />
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <main className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-100'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}