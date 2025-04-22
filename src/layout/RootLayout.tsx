import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useDarkMode } from "../hooks/useDarkMode";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    const { isDarkMode } = useDarkMode();

    return (
        <div className="flex h-screen">
            <Sidebar isDarkMode={isDarkMode} />
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <Header isDarkMode={isDarkMode} />
                <main className={`flex-1 overflow-y-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-slate-300'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}