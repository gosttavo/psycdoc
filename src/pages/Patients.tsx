import { useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import mock from "../database/mock.json"

export default function Patients() {
    const { isDarkMode } = useDarkMode();
    const [patients] = useState(mock.patients);

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