interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
    return (
        <header className={`w-full ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-slate-200'}`}>
            <div className="w-full px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className={`text-xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        PsycDoc
                    </h1>
                </div>
                
                <button 
                    className={`cursor-pointer px-3 py-2 rounded-md flex items-center transition-all ${isDarkMode 
                        ? 'bg-gray-700 text-blue-300 hover:bg-gray-600 border border-gray-600' 
                        : 'bg-slate-100 text-blue-600 hover:bg-slate-200 border border-slate-300'
                    }`}
                    onClick={toggleDarkMode}
                    type="button"
                >
                    {isDarkMode ? (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Light Mode
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            Dark Mode
                        </>
                    )}
                </button>
            </div>
        </header>
    )
}