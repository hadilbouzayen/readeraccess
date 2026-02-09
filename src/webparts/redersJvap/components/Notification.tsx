import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface NotificationProps {
    notify: { isOpen: boolean, message: string, type: 'success' | 'error' | 'warning' | 'info' };
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notify, onClose }) => {
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string): void => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <Snackbar
            open={notify.isOpen}
            autoHideDuration={10000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}
        >
            <Alert
                severity={notify.type}
                onClose={handleClose}
            >
                {notify.message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
