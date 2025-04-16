import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import Table from "../components/Table";
import mock from "../database/mock.json"
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Patients() {
    const { isDarkMode } = useDarkMode();
    const [patients] = useState(mock.patients);

    const openViewModal = (row: any) => {}
    const openEditModal = (row: any) => {}
    const confirmDelete = (row: any) => {}

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Pacientes
                </h1>
            </div>

            <div>
                <Table
                    theme={isDarkMode ? "dark" : "light"}
                    data={patients}
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
                          key: 'document', 
                          label: 'CPF',
                          render: (value) => <code>{value}</code>
                        }
                    ]}
                    actions={[
                        {
                            label: 'Visualizar',
                            icon: <EyeIcon className="h-4 w-4" />,
                            action: (row) => openViewModal(row)
                        },
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