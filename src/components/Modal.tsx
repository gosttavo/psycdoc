import { Fade, Box, Typography, Modal, Backdrop, Button } from "@mui/material";
import { useDarkMode } from "../hooks/useDarkMode";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalWrapperProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
}

export default function ModalWrapper({
    open,
    onClose,
    title,
    children,
    width = 'auto',
    height = 'auto'
}: ModalWrapperProps) {
    const { isDarkMode } = useDarkMode();

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
        width,
        height,
        maxHeight: '90vh', // Limite a altura máxima
        overflowY: 'auto',  // Permite rolagem se ultrapassar
        backgroundColor: isDarkMode ? '#1e2939' : 'white',
        color: isDarkMode ? '#e2e8f0' : '#1e2939',
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 500 } }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        width: '100%'
                    }}>
                        <Typography variant="h6" component="h2">
                            {title}
                        </Typography>
                        <Button 
                            onClick={onClose}
                            sx={{
                                minWidth: 'auto',
                                p: 0,
                                color: isDarkMode ? '#e2e8f0' : '#1e2939',
                            }}
                        >
                            <XMarkIcon className="h-6 w-6" /> 
                        </Button>
                    </Box>
                    {children}
                </Box>
            </Fade>
        </Modal>
    );
}