import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useLanguage } from "../../services/LanguageContext";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  loading,
}) => {
  const { translations } = useLanguage();
  return (
    <Dialog open={open} onClose={onClose}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: loading ? "flex" : "none",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ width: "300px", padding: "20px" }}>
        <DialogTitle>{translations.action.delete}</DialogTitle>
        <DialogContent>
          {translations.card.areYouSure}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {translations.action.cancel}
          </Button>
          <Button onClick={async () => {
            await onConfirm(); // run confirm logic (can be async)
            onClose(); // then close the dialog
          }} color="warning">
            {translations.action.delete}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
