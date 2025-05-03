import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import mock from "../database/mock.json"
import { Patient } from "../interfaces/Patient";

interface ModalAction {
    row: Patient;
    type: 'edit' | 'consult' | 'delete';
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

export default function Patients() {
    const [patients] = useState<Patient[]>(mock.patients);

    const { isDarkMode } = useDarkMode();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const [selectedRow, setSelectedRow] = useState<Patient | null>(null);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openEncounterModal, setOpenEncounterModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // #region Form Handling

    // const { reset, handleSubmit, register } = useForm<FormInitEncounterSchema>({
    //     resolver: zodResolver(formInitEncounterSchema)
    // })

    // #endregion
    
    // #region Dropdown Menu

    const prevOpen = useRef(openMenuIndex !== null);

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        setAnchorEl(event.currentTarget);
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleClose = () => {
        setOpenMenuIndex(null);
        setAnchorEl(null);
    };

    const handleListKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Tab' || event.key === 'Escape') {
            event.preventDefault();
            setOpenMenuIndex(null);
        }
    };

    // #endregion

    // #region Modal Handlers

    const openModal = (row: Patient, type: ModalAction['type']) => {
        handleClose();
        setSelectedRow(row);
        switch (type) {
            case 'edit':
                setOpenEditModal(true);
                break;
            case 'delete':
                setOpenDeleteModal(true);
                break;
            default:
                break;
        }
    };

    // #endregion

    useEffect(() => {
        if (prevOpen.current && openMenuIndex === null) {
            anchorEl?.focus();
        }
        prevOpen.current = openMenuIndex !== null;
    }, [openMenuIndex, anchorEl]);


    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Pacientes
                </h1>
            </div>
        </div>
    )
}