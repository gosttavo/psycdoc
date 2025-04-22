import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import Table from "../components/Table";
import mock from "../database/mock.json"
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Users() {
    const { isDarkMode } = useDarkMode();
    const [users] = useState(mock.users);

    const openEditModal = (row: any) => {}
    const confirmDelete = (row: any) => {}

    return (
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Médicos
          </h1>
        </div>

        <div>
          <Table
              theme={isDarkMode ? "dark" : "light"}
              data={users}
              columns={[
                  { 
                    key: 'name', 
                    label: 'Nome',
                    render: (value) => <span className="font-medium">{value}</span>
                  },
                  { key: 'email', label: 'E-mail' },
                  { 
                    key: 'phone', 
                    label: 'Telefone',
                    render: (value) => value || 'Não informado'
                  },
                  { 
                    key: 'documentCrm', 
                    label: 'CRM',
                    render: (value) => <code>{value}</code>
                  }
              ]}
              actions={[
                {
                    label: 'Editar',
                    icon: <PencilIcon className="h-4 w-4" />,
                    action: (row) => openEditModal(row)
                },
                {
                    label: 'Excluir',
                    icon: <TrashIcon className="h-4 w-4" />,
                    action: (row) => confirmDelete(row)
                }
            ]}
          />
        </div>
      </div>
    )
}