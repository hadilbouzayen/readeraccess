import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Autocomplete,
    CircularProgress,
    Typography,
    ListSubheader,
    Box,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getAllFocalPoints } from '../../services/sharepointService';
import { useLanguage } from '../../services/LanguageContext';

interface FocalPoint {
    Id: number;
    Title: string;
    field_1: string;
    field_2: string;
    field_5?: string;
}

export interface AssignToFocalPointProps {
    open: boolean;
    onClose: () => void;
    onAssign: (focalPointEmail: string) => void;
    readerIds: number[];
}


// Styled header row
const HeaderRow = styled(ListSubheader)(({ theme }) => ({
    display: 'flex',
    gap: 12,
    padding: '8px 16px',
    fontWeight: 600,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

// Custom listbox to include header + items
const CustomListbox = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLElement>>(function CustomListbox(props, ref) {
    const { children, ...rest } = props;
    const { translations } = useLanguage();
    return (
        <ul ref={ref} {...rest}>
            <HeaderRow disableSticky>
                {/* <Box sx={{ flex: 1 }}>Name</Box>
                <Box sx={{ flex: 1 }}>Field 1</Box>
                <Box sx={{ flex: 1 }}>Field 2</Box>
                <Box sx={{ flex: 1 }}>Field 5</Box> */}
                <Box sx={{ flex: 1 }}>{translations.TableColumn.Name}</Box>
                <Box sx={{ flex: 1 }}>{translations.TableColumn.Email}</Box>
                <Box sx={{ flex: 1 }}>{translations.TableColumn.Partner}</Box>
                <Box sx={{ flex: 1 }}>{translations.TableColumn.Organisation}</Box>
            </HeaderRow>
            {children}
        </ul>
    );
});

const AssignToFocalPoint: React.FC<AssignToFocalPointProps> = ({
    open,
    onClose,
    onAssign,
    readerIds,
}) => {
    const [focalPoints, setFocalPoints] = useState<FocalPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFocalPoint, setSelectedFocalPoint] = useState<FocalPoint | null>(null);
    const { translations } = useLanguage();
    useEffect(() => {
        if (!open) return;

        setLoading(true);
        getAllFocalPoints()
            .then((data) => setFocalPoints(data))
            .catch((err) => console.error("Error loading focal points", err))
            .finally(() => setLoading(false));
    }, [open]);

    const handleAssign = (): void => {
        if (selectedFocalPoint) {
            onAssign(selectedFocalPoint.field_1);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>{translations.AssigntoFocalPoint.AssigntoFocalPoint}</DialogTitle>
            <DialogContent>
                {readerIds.length === 0 ? (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {translations.AssigntoFocalPoint.NoReder}
                    </Typography>
                ) : (
                    <Typography sx={{ mb: 2 }}>
                        {translations.AssigntoFocalPoint.you} <strong>{readerIds.length}</strong> {translations.AssigntoFocalPoint.reader}{readerIds.length > 1 ? 's' : ''} {translations.AssigntoFocalPoint.tofp}.
                    </Typography>
                )}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Autocomplete
                        options={focalPoints}
                        getOptionLabel={(option) =>
                            `${option.Title} (${option.field_1}) - ${option.field_2}`
                        }
                        filterOptions={(options, { inputValue }) =>
                            options.filter((fp) =>
                                `${fp.Title} ${fp.field_1} ${fp.field_2} ${fp.field_5 ?? ''}`
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            )
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={translations.AssigntoFocalPoint.serchfocal}
                                fullWidth
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} style={{ display: 'flex', gap: 12, padding: '8px 16px' }}>
                                <Typography variant="body2" sx={{ flex: 1 }}>{option.Title}</Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>{option.field_1}</Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>{option.field_2}</Typography>
                                <Typography variant="body2" sx={{ flex: 1 }}>{option.field_5 ?? '-'}</Typography>
                            </li>
                        )}
                        value={selectedFocalPoint}
                        onChange={(_, value) => setSelectedFocalPoint(value)}
                        disabled={readerIds.length === 0}
                        ListboxComponent={CustomListbox}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{translations.AssigntoFocalPoint.cancel}</Button>
                <Button
                    onClick={handleAssign}
                    disabled={!selectedFocalPoint || readerIds.length === 0}
                    variant="contained"
                >
                    {translations.AssigntoFocalPoint.assign}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignToFocalPoint;
