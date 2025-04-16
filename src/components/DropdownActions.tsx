import { useState } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  action: (row: any) => void;
  className?: string;
}

interface DropdownActionsProps {
  actions: TableAction[];
  row: any;
  theme?: 'light' | 'dark';
}

export function DropdownActions({ actions, row, theme = 'light' }: DropdownActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`cursor-pointer p-1 rounded-full ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
      >
        <EllipsisVerticalIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-700'}`} />
      </button>
      
      {isOpen && (
        <div 
          className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg ${theme === 'dark' ? 'bg-slate-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200 ring-opacity-5'}`}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-1">
            {actions.map((action, actionIndex) => (
              <button
                key={actionIndex}
                onClick={() => {
                  action.action(row);
                  setIsOpen(false);
                }}
                className={`cursor-pointer block w-full text-left px-4 py-2 text-sm ${action.className || (theme === 'dark' ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-slate-100')}`}
              >
                <div className="flex items-center">
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}