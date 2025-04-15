interface HeaderProps {
    isDarkMode: boolean | (() => void);
    toggleDarkMode: boolean | (() => void);
}

export default function Header({ isDarkMode, toggleDarkMode }: HeaderProps) {
    console.log(`isDarkMode: ${isDarkMode}`);
    console.log(`toggleDarkMode: ${toggleDarkMode}`);

    return (
        <header className="bg-white dark:bg-gray-700 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    PsycDoc
                </h1>
            </div>
        </header>
    )
}