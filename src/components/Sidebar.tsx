import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { ChartBarIcon, Cog6ToothIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isDarkMode: boolean;
}

export default function Sidebar({ isDarkMode }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigation = [
        { name: 'Dashboard', href: '/', icon: <ChartBarIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}/> },
        { name: 'Pacientes', href: '/patients', icon: <UsersIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}/> },
        { name: 'Médicos', href: '/users', icon: <UserIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}/> },
        { name: 'Configurações', href: '/settings', icon: <Cog6ToothIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}/> },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-slate-200'}`}>
                <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div 
                        className="flex items-center flex-shrink-0 px-4 cursor-pointer"
                        onClick={toggleSidebar}
                    >
                        <h1 className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} ${isCollapsed ? 'text-center w-full' : ''}`}>
                            {isCollapsed ? 'PD' : 'PsycDoc'}
                        </h1>
                    </div>
                    
                    <nav className="mt-6 flex-1 px-2 space-y-1">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive
                                            ? isDarkMode 
                                                ? 'bg-gray-700 text-white' 
                                                : 'bg-blue-100 text-blue-800'
                                            : isDarkMode
                                                ? 'text-blue-200 hover:bg-gray-700 hover:text-white'
                                                : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                                    } ${isCollapsed ? 'justify-center' : ''}`
                                }
                            >
                                <span className={`flex-shrink-0 h-6 w-6 ${isCollapsed ? 'mr-0' : 'mr-3'} ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                                    {item?.icon}
                                </span>
                                {!isCollapsed && item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                
                <div className={`flex-shrink-0 flex border-t p-4 ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center w-full">
                        <div className={`border rounded-full p-1 ${isDarkMode ? 'border-gray-600' : 'border-slate-300'}`}>
                            <span className={`inline-block h-8 w-8 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-slate-200'}`}>
                                <svg className={`h-full w-full ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                        </div>
                        {!isCollapsed && (
                            <div className="ml-3 flex-1">
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Dr. Usuário</p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Admin</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <button className={`p-1 cursor-pointer rounded-md ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}