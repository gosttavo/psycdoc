import { useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function ClinicalEncounter() {
    const { isDarkMode } = useDarkMode();
    const { showToast } = useToast();

    useEffect(() => {
        showToast("Consulta iniciada!", "success");
    }, []);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Consulta
                </h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
            </div>
        </div>
    );
}