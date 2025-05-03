import { useForm } from "react-hook-form";
import { formSearchSchema, FormSearchSchema } from "../schemas/formSearch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDarkMode } from "../hooks/useDarkMode";

interface FormSearchProps {
    onSubmit: (data: FormSearchSchema) => void;
    placeholder?: string;
}

export default function FormSearch({
    onSubmit,
    placeholder
}: FormSearchProps) {
    const { isDarkMode } = useDarkMode();
    
    const {
        handleSubmit: searchSubmit,
        register: searchRegister
    } = useForm<FormSearchSchema>({
        resolver: zodResolver(formSearchSchema)
    })

    return (
        <div className="flex flex-col mb-4">
            <form 
                onSubmit={searchSubmit((data) => { onSubmit(data) })}
                className={`flex items-center gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl rounded-2xl p-3 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
                <input
                    type="text"
                    {...searchRegister('searchText')}
                    placeholder={placeholder || "Pesquisar..."}
                    className={`flex-1 p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                />
                <Button type="submit" variant="outlined">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Pesquisar
                </Button>
            </form>
        </div>
    )
    
};