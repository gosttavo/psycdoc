import { DropdownActions } from './DropdownActions';

interface TableAction {
    label: string;
    icon?: React.ReactNode;
    action: (row: any) => void;
    className?: string;
}

interface TableProps {
  theme?: 'light' | 'dark';
  data: Record<string, any>[];
  columns?: {
    key: string;
    label?: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  actions?: TableAction[];
}

export default function Table({
  theme = "light",
  data = [],
  columns,
  actions = []
}: TableProps) {
  const effectiveColumns = columns || (data[0] ? Object.keys(data[0]).map(key => ({ key, label: key })) : []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-slate-50'}`}>
          <tr>
            {effectiveColumns.map((column, index) => (
              <th 
                key={index} 
                scope="col" 
                className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'} uppercase tracking-wider`}
              >
                {column.label || column.key}
              </th>
            ))}
            {actions.length > 0 && <th scope="col" className="relative px-6 py-3"></th>}
          </tr>
        </thead>
        <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
            >
              {effectiveColumns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}
                >
                  {'render' in column && column.render ? 
                    column.render(row[column.key], row) : 
                    String(row[column.key] ?? '-')}
                </td>
              ))}
              
              {actions.length > 0 && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <DropdownActions 
                    actions={actions} 
                    row={row} 
                    theme={theme} 
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}