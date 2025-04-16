import { useDarkMode } from "../hooks/useDarkMode";

export default function Home() {
    const { isDarkMode } = useDarkMode();

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Próximas consultas
                </h1>
            </div>
        </div>
    )
}