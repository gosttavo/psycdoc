import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useDarkMode from "../hooks/useDarkMode";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    return (
        <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex h-full w-full bg-gray-100 dark:bg-gray-900">
                <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}