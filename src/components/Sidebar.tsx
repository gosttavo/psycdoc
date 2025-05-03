import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { ChartBarIcon, Cog6ToothIcon, UsersIcon, UserIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  isDarkMode: boolean;
}

export default function Sidebar({ isDarkMode }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigation = [
        { name: 'Consultas', href: '/', icon: <ChartBarIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> },
        { name: 'Pacientes', href: '/patients', icon: <UsersIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> },
        { name: 'Médicos', href: '/users', icon: <UserIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-18' : 'w-50'}`}>
            <div className={`relative flex flex-col h-full items-center ${isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-slate-100 border-r border-slate-300'}`}>
                <div
                    className={`flex items-center justify-center flex-shrink-0 p-4 mb-1 cursor-pointer w-full border-b ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}
                    onClick={toggleSidebar}
                >
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} ${isCollapsed ? 'text-center w-full' : ''}`}>
                        {isCollapsed ? 'PD' : 'PsycDoc'}
                    </h1>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 px-2 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `group flex items-center px-2 py-2 text-md font-medium rounded-md transition-colors w-full ${
                                    isActive
                                        ? isDarkMode
                                            ? 'bg-gray-700 text-blue-400'
                                            : 'bg-blue-100 text-blue-800'
                                        : isDarkMode
                                            ? 'text-blue-400 hover:bg-gray-700 hover:text-white'
                                            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                                } ${isCollapsed ? 'justify-center' : 'justify-start'}`
                            }
                        >
                            <span className={`h-6 w-6 ${isCollapsed ? 'mr-0' : 'mr-3'}`}>
                                {item.icon}
                            </span>
                            {!isCollapsed && item.name}
                        </NavLink>
                    ))}
                </div>

                <div className={`mt-auto px-2 py-4 w-full border-t ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `group flex items-center px-2 py-2 text-md font-medium rounded-md transition-colors w-full ${
                                isActive
                                    ? isDarkMode
                                        ? 'bg-gray-700 text-blue-400'
                                        : 'bg-blue-100 text-blue-800'
                                    : isDarkMode
                                        ? 'text-blue-400 hover:bg-gray-700 hover:text-white'
                                        : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                            } ${isCollapsed ? 'justify-center' : 'justify-start'}`
                        }
                    >
                        <span className={`h-6 w-6 ${isCollapsed ? 'mr-0' : 'mr-3'}`}>
                            <Cog6ToothIcon className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </span>
                        {!isCollapsed && 'Configurações'}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
