import { useEffect } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { Button, ButtonGroup } from '@mui/material';

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
  id: string | number;
  activeDropdown: string | number | null;
  setActiveDropdown: (id: string | number | null) => void;
}

export function DropdownActions({ 
  actions, 
  row, 
  theme = 'light', 
  id,
  activeDropdown,
  setActiveDropdown
}: DropdownActionsProps) {
  const isOpen = activeDropdown === id;

  const toggleDropdown = () => {
    if (isOpen) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.dropdown-${id}`)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [id, setActiveDropdown]);

  return (
    <div className={`relative dropdown-${id}`}>
      <Button
        type="button"
        onClick={toggleDropdown}
        className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
      >
        <EllipsisVerticalIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-700'}`} />
      </Button>
      
      {isOpen && (
        <div 
          className={`fixed z-[1000] right-0 mt-2 origin-top-right rounded-md shadow-lg ${theme === 'dark' ? 'bg-slate-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200 ring-opacity-5'}`}
          style={{
            right: 'auto',
            left: 'auto',
            transform: 'translateX(-50%)'
          }}
        >
          <ButtonGroup orientation="vertical" className={`rounded-md ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            {actions.map((action, actionIndex) => (
              <Button
                key={actionIndex}
                onClick={() => {
                  action.action(row);
                  setActiveDropdown(null);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${action.className || (theme === 'dark' ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-slate-300')}`}
              >
                <div className="flex items-center">
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </div>
              </Button>
            ))}
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}