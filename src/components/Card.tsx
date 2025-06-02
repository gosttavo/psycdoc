import { useDarkMode } from "../hooks/useDarkMode";

export default function Card({
    children,
    customClass
}: {
    children: React.ReactNode,
    customClass?: string
}) {
    const { isDarkMode } = useDarkMode();

    return (
        <div
            className={`flex flex-col ${isDarkMode ? 'text-slate-300 bg-gray-800 border-gray-700' : 'text-slate-700 bg-white border-gray-200'} shadow-xl rounded-2xl p-6 mb-6 border ${customClass}`}
        >
            {children}
        </div>
    )
};
