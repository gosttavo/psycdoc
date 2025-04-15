import { NavLink } from 'react-router-dom';

interface SidebarProps {
    isDarkMode: boolean | (() => void);
    toggleDarkMode: boolean | (() => void);
}

export default function Sidebar({ isDarkMode, toggleDarkMode }: SidebarProps) {
    console.log(`isDarkMode: ${isDarkMode}`);
    console.log(`toggleDarkMode: ${toggleDarkMode}`);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: 'home' },
        { name: 'Pacientes', href: '/patients', icon: 'users' },
        { name: 'Usuários', href: '/users', icon: 'users' },
        { name: 'Configurações', href: '/settings', icon: 'cog' },
    ];

    return (
        <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Logo</h1>
            </div>
            
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 dark:text-gray-300">
                    {/* Ícones (mantidos como antes) */}
                  </span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-600 p-4">
            <div className="flex items-center">
              <div>
                <span className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-600">
                  <svg className="h-full w-full text-gray-300 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Usuário</p>
                <button className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}