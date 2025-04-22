import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { DropdownActions } from './DropdownActions';

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  action: (row: any) => void;
  className?: string;
}

interface Column {
  key: string;
  label?: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  render?: (value: any, row: any) => React.ReactNode;
  format?: (value: any) => string;
}

interface TableProps {
  theme?: 'light' | 'dark';
  data: Record<string, any>[];
  columns?: Column[];
  actions?: TableAction[];
  pagination?: boolean;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
}

export default function CustomTable({
  theme = "light",
  data = [],
  columns,
  actions = [],
  pagination = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [10, 25, 100]
}: TableProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [activeDropdown, setActiveDropdown] = React.useState<string | number | null>(null);

  const effectiveColumns: Column[] = columns || 
    (data[0] ? Object.keys(data[0]).map(key => ({ 
      key, 
      label: key,
      minWidth: 170 
    })) : []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (actions.length > 0 && !effectiveColumns.some(col => col.key === 'actions')) {
    effectiveColumns.push({
      key: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right'
    });
  }

  return (
    <Paper sx={{ 
      width: '100%', 
      overflow: 'hidden',
      backgroundColor: theme === 'dark' ? '#1e2939' : 'white'
    }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {effectiveColumns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  style={{ 
                    minWidth: column.minWidth,
                    backgroundColor: theme === 'dark' ? '#1e2939' : '#f8fafc',
                    color: theme === 'dark' ? '#e2e8f0' : '#1e2939'
                  }}
                >
                  {column.label || column.key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => {
                return (
                  <TableRow 
                    hover 
                    role="checkbox" 
                    tabIndex={-1} 
                    key={rowIndex}
                    sx={{
                      backgroundColor: theme === 'dark' ? '#1e2939' : 'white',
                      '&:hover': {
                        backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9'
                      }
                    }}
                  >
                    {effectiveColumns.map((column) => {
                      if (column.key === 'actions') {
                        return (
                          <TableCell 
                            key={column.key} 
                            align={column.align}
                            sx={{ color: theme === 'dark' ? '#e2e8f0' : '#1e2939' }}
                          >
                            {actions.length > 0 && (
                              <DropdownActions 
                                actions={actions} 
                                row={row} 
                                theme={theme}
                                id={rowIndex}
                                activeDropdown={activeDropdown}
                                setActiveDropdown={setActiveDropdown}
                              />
                            )}
                          </TableCell>
                        );
                      }

                      const value = row[column.key];
                      return (
                        <TableCell 
                          key={column.key} 
                          align={column.align}
                          sx={{ color: theme === 'dark' ? '#e2e8f0' : '#1e2939' }}
                        >
                          {column.render 
                            ? column.render(value, row) 
                            : column.format && typeof value === 'number'
                              ? column.format(value)
                              : value !== undefined && value !== null 
                                ? String(value) 
                                : '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ 
            color: theme === 'dark' ? '#e2e8f0' : '#1e2939',
            backgroundColor: theme === 'dark' ? '#1e2939' : '#f8fafc'
          }}
        />
      )}
    </Paper>
  );
}