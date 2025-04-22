import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import CustomTable from "../components/Table";
import mock from "../database/mock.json"

export default function Home() {
    const { isDarkMode } = useDarkMode();
    const { user } = useAuth();
    const [clinicalEncounters] = useState(mock.clinicalEncounters);

    const openViewModal = (row: any) => {}
    const openEditModal = (row: any) => {}
    const confirmDelete = (row: any) => {}

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Olá Dr(a) ${user?.nameCalledBy ? user?.nameCalledBy : user?.nameGiven}! Suas próximas consultas.
                </h1>
            </div>
            <CustomTable
                theme={isDarkMode ? "dark" : "light"}
                data={clinicalEncounters}
                columns={[
                    { 
                        key: 'patientName', 
                        label: 'Nome',
                        render: (value) => <span className="font-medium">{value}</span>
                    },
                    { key: 'patientEmail', label: 'E-mail' },
                    { 
                        key: 'patientPhone', 
                        label: 'Telefone',
                        render: (value) => value || 'Não informado'
                    },
                    { 
                        key: 'patientDocument', 
                        label: 'CPF',
                        render: (value) => <code>{value}</code>
                    }
                ]}
                actions={[
                    {
                        label: 'Consulta',
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
    )
}