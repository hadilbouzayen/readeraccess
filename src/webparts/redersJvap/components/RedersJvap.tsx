/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

import type { IRedersJvapProps } from './IRedersJvapProps';
import { useEffect, useState } from 'react';
import { useLanguage } from '../../services/LanguageContext';
import { Backdrop, Badge, Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, ListItemText, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import Notification from "./Notification";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContactCard from './contactCard';
import { acceptReaders, assignFocalPointToReaders, deleteReaders, getAllReaders, rejectReaders, filterFocalPointList } from '../../services/sharepointService';
import AssignToFocalPoint from './AssignToFocalPoint';
import { FilterAlt, FilterAltOff, RestartAlt } from '@mui/icons-material';
import ConfirmationDialog from './ConfirmationDialog';





const RedersJvap: React.FC<IRedersJvapProps> = ({ siteLanguage, isAdmin, isFocalPoint, currentUser }) => {


  const { language, setLanguage, translations } = useLanguage();
  useEffect(() => {
    setLanguage(siteLanguage)
  }, []);
  // const handleToggleLanguageChange = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newLanguage: string | null
  // ) => {
  //   if (newLanguage !== null) {
  //     setLanguage(newLanguage);
  //   }
  // };


  // const [isFP, setIsFP] = useState(false);
  // const [isADMIN, setISAdmin] = useState(true);

  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readers, setReaders] = React.useState<any[]>([]); // Start with empty array


  const [isDialogOpen, setisDialogOpen] = useState(false);
  const [isMultipleDialogOpen, setMultipleisDialogOpen] = useState(false);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "warning" | "info",
  });



  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);


  const [filteredReaders, setFilteredReaders] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Focal Point Details State
  const [userInfo, setUserInfo] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    const fetchFocalPointInfo = async () => {
      if (isFocalPoint) {
        try {
          const data = await filterFocalPointList(currentUser.Email);
          setUserInfo({ focalPointResult: data });
        } catch (error) {
          console.error("Error fetching focal point details:", error);
        }
      }
    };
    void fetchFocalPointInfo();
  }, [isFocalPoint, currentUser.Email]);

  // Calculate counts based on readers status
  useEffect(() => {
    if (readers) {
      setPendingCount(readers.filter(r => r.Status === 'Pending').length);
      setRejectedCount(readers.filter(r => r.Status === 'Rejected').length);
      setApprovedCount(readers.filter(r => r.Status === 'Accepted').length);
    }
  }, [readers]);


  const readersColumns = [

    { id: "FullName", label: translations.TableColumn.FullName, type: "text" },
    { id: "Email", label: translations.TableColumn.Email, type: "user" },
    { id: "Status", label: translations.TableColumn.SubmissionFinished, type: "status" },

    { id: "Partner", label: translations.TableColumn.Partner, type: "multiselect" },
    { id: "FocalPointMail", label: translations.TableColumn.FocalPointEmail, type: "user" },
    { id: "Title", label: translations.TableColumn.JobTitle, type: "text" },
    { id: "Organization", label: translations.TableColumn.Organisation, type: "multiselect" },
    { id: "Department", label: translations.TableColumn.Department, type: "text" },
    { id: "RequestReason", label: translations.TableColumn.Reason, type: "text" },


  ];

  // Define column width sizes
  const columnWidths: Record<string, string> = {
    large: "250px",
    medium: "200px",
    semiMedium: "150px",
    small: "100px",
    mini: "80px",
  };

  // Define mapping for specific columns
  const columnSizeMapping: Record<string, string> = {


    Title: columnWidths.semiMedium,
    FullName: columnWidths.semiMedium,
    Email: columnWidths.medium,
    Partner: columnWidths.semiMedium,
    Organization: columnWidths.semiMedium,
    Department: columnWidths.semiMedium,
    RequestReason: columnWidths.large,
    FocalPointMail: columnWidths.medium,
    Status: columnWidths.semiMedium,
  };



  useEffect(() => {
    const userEmail = currentUser.Email; // Replace this with actual user email from context/session

    setLoading(true);
    getAllReaders(userEmail, isFocalPoint, isAdmin)
      .then((data) => setReaders(data))
      .catch((error) => {
        console.error("Failed to fetch readers:", error);
        setAccessDenied(true);
      })
      .finally(() => setLoading(false));
  }, [isFocalPoint, isAdmin]);












  const handleApprove = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await acceptReaders([id]);
      const updatedReaders = await getAllReaders(currentUser.Email, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);

      // ✅ Success notification
      setNotify({
        isOpen: true,
        // message: "Reader approved successfully.",
        message: `${translations.notification.approveSuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to approve reader:", error);
      setNotify({
        isOpen: true,
        // message: "Failed to approve reader.",
        message: `${translations.notification.approveFailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await rejectReaders([id]);
      const updatedReaders = await getAllReaders(currentUser.Email, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);
      setNotify({
        isOpen: true,
        // message: "Reader rejected successfully.",
        message: `${translations.notification.Rejectsuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to reject reader:", error);
      setNotify({
        isOpen: true,
        // message: "Failed to reject reader.",
        message: `${translations.notification.RejectFailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await deleteReaders([id]);
      const updatedReaders = await getAllReaders(currentUser.Email, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);
      setNotify({
        isOpen: true,
        // message: "Reader rejected successfully.",
        message: `${translations.notification.deleteSuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to reject reader:", error);
      setNotify({
        isOpen: true,
        // message: "Failed to reject reader.",
        message: `${translations.notification.deleteFailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteAll = async (): Promise<void> => {
    try {
      setLoading(true);
      await deleteReaders(selectedIds);
      const updatedReaders = await getAllReaders(currentUser.Email, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);
      setNotify({
        isOpen: true,
        // message: "Reader rejected successfully.",
        message: `${translations.notification.deleteAllSuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to reject reader:", error);
      setNotify({
        isOpen: true,
        message: `${translations.notification.deleteAllFailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleApproveAll = async (): Promise<void> => {
    try {
      setLoading(true);
      await acceptReaders(selectedIds);
      const updatedReaders = await getAllReaders(currentUser.Email, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);

      setNotify({
        isOpen: true,
        // message: "All selected readers approved successfully.",
        message: `${translations.notification.approveallsuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to approve all selected readers:", error);
      setNotify({
        isOpen: true,
        // message: "Failed to approve all selected readers.",
        message: `${translations.notification.approveallfailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAll = async (): Promise<void> => {
    try {
      setLoading(true);
      await rejectReaders(selectedIds);
      const updatedReaders = await getAllReaders(currentUser.Email, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);

      setNotify({
        isOpen: true,
        // message: "All selected readers rejected successfully.",
        message: `${translations.notification.RejectAllsuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to reject all selected readers:", error);

      setNotify({
        isOpen: true,
        // message: "Failed to reject all selected readers.",
        message: `${translations.notification.RejectAllFailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };





  // const handleView = (id: number) => {
  //   // TODO: Navigate or open modal
  //   console.log("View:", id);
  // };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAssign = async (focalPointEmail: string): Promise<void> => {
    try {
      setLoading(true);
      await assignFocalPointToReaders(selectedIds, focalPointEmail);
      // Optionally reload readers to reflect changes
      const userEmail = currentUser.Email;
      const updatedReaders = await getAllReaders(userEmail, isFocalPoint, isAdmin);
      setReaders(updatedReaders);
      setSelectedIds([]);  // Clear selection
      setAssignDialogOpen(false);
      // Show success notification or toast here if you have one
      // console.log(`Assigned focal point ${focalPointEmail} to readers:`, selectedIds);
      setNotify({
        isOpen: true,
        // message: `Assigned focal point ${focalPointEmail} successfully!`,
        message: `${translations.notification.assignSuccess}`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to assign focal point:", error);
      // Optionally show error notification
      setNotify({
        isOpen: true,
        // message: "Failed to assign focal point.",

        message: `${translations.notification.assignFailed}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const applyFilters = (): void => {
      const result = readers.filter((reader) => {
        return Object.entries(filters).every(([key, value]) => {
          const cellValue = (reader[key] ?? "").toString().toLowerCase();

          if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
            return true;
          }

          if (key === "Status" && Array.isArray(value)) {
            return value.includes(reader.Status);
          }

          return cellValue.includes(value.toLowerCase());
        });
      });

      setFilteredReaders(result);
    };

    applyFilters();
  }, [readers, filters]);





  if (accessDenied) {
    // return <h3>Access Denied: You do not have the required permissions.</h3>;
    return <h3>{translations.card.accessDinied}</h3>;
  }


  return (
    <div>
      <Notification
        notify={notify}
        onClose={() => setNotify({ ...notify, isOpen: false })}
      />
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
      {/* Top bar */}
      {/* <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          mb: 2, // margin bottom for spacing
        }}
      >
    
        <Box display="flex" alignItems="left" mb={2} sx={{ gap: "8px" }}>
          <Button
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start", // Align content to the left
              width: "fit-content",
              padding: "10px",
            }}
            disableElevation
            component="a"
            target="_self"
            href={isAdmin ? "https://jvap.sharepoint.com/sites/ICMPD/SitePages/Admin.aspx" : "https://jvap.sharepoint.com/sites/ICMPD/SitePages/Initiatives.aspx"}
          >
            <ArrowBackIcon sx={{ mr: 1, fontSize: "1rem" }} />
           
            {translations.action.back}
          </Button>



        </Box>
        <Box
          sx={{
            width: "80%",
            display: "flex",
            justifyContent: "flex-end",
            mb: 2, 
          }}
        >
          <ToggleButtonGroup
            value={language}
            exclusive
            onChange={handleToggleLanguageChange}
            aria-label="Language Switcher"
            size="small"
            color="primary"
          >
            <ToggleButton value="en" aria-label="English">
              <img
                src={require("../assets/eng.png")}
                alt="English Flag"
                style={{
                  width: "20px",
                  marginRight: "5px",
                  objectFit: "cover",
                }}
              />
              EN
            </ToggleButton>
            <ToggleButton value="fr" aria-label="French">
              <img
                src={require("../assets/fr.png")}
                alt="French Flag"
                style={{
                  width: "20px",
                  marginRight: "5px",
                  objectFit: "cover",
                }}
              />
              FR
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box> */}


      {/* Contact Card for Focal Point or Admin */}
      {((isFocalPoint && userInfo) || (isAdmin && currentUser)) && (
        <ContactCard
          isFP={isFocalPoint}
          isC={false}
          userInfo={isFocalPoint ? userInfo : currentUser}


          pendingCount={pendingCount}
          rejectedCount={rejectedCount}
          approvedCount={approvedCount}
          setTriggerNotif={() => { /* dummy */ }} // dummy for now
          datalenth={0} // dummy
          language={language}
          onLanguageChange={setLanguage}
          translations={translations}
          isAdmin={isAdmin}
        />
      )}












      <Box
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 100,
          backgroundColor: "white",
        }}
      >
        {/* Initiative Command Bar */}
        <Box display="flex" alignItems="center" justifyContent="space-between" >





          {/* Toolbar with action buttons */}

          {(isFocalPoint || isAdmin) && (
            <Toolbar sx={{ mt: 1 }}>
              {/* 
              {isAdmin && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setAssignDialogOpen(true)}
                  sx={{ mr: 1 }}
                >
                  {translations.action.assign}
                </Button>
              )} */}


              {/* {isAdmin && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setAssignDialogOpen(true)}
                  sx={{ mr: 1 }}
                  disabled={
                    !selectedIds.some((id) => {
                      const selectedReader = filteredReaders.find((r) => r.ID === id);
                      return selectedReader && selectedReader.Status === "Pending";
                    })
                  }
                >
                  {translations.action.assign}
                </Button>
              )} */}
              {/* {selectedIds.length > 0 && (
                <>

                  {selectedIds.length === 1 && (() => {
                    const selectedReader = filteredReaders.find(r => r.ID === selectedIds[0]);
                    if (!selectedReader) return null;

                    const isPending = selectedReader.Status === "Pending";

                    return (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setAssignDialogOpen(true)}
                        sx={{ mr: 1 }}
                        disabled={!isPending}
                      >
                        {translations.action.assign}
                      </Button>
                    );
                  })()}


                  {selectedIds.length > 1 && (() => {
                    const selectedReaders = filteredReaders.filter(r => selectedIds.includes(r.ID));
                    if (selectedReaders.length === 0) return null;

                    const allPending = selectedReaders.every(r => r.Status === "Pending");

                    return (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setAssignDialogOpen(true)}
                        sx={{ mr: 1 }}
                        disabled={!allPending}
                      >
                        {translations.action.assign}
                      </Button>
                    );
                  })()}
                </>
              )} */}

              {/* Assign to Focal Point button — always visible */}
              {isAdmin && <Button
                variant="contained"
                color="primary"
                onClick={() => setAssignDialogOpen(true)}
                sx={{ mr: 1 }}
                disabled={
                  selectedIds.length === 0 || // no selection
                  !filteredReaders
                    .filter((r) => selectedIds.includes(r.ID))
                    .every((r) => r.Status === "Pending") // all must be Pending
                }
              >
                {translations.action.assign}
              </Button>}


              {selectedIds.length > 0 && (
                <>
                  {selectedIds.length === 1 && (() => {
                    const selectedReader = filteredReaders.find(r => r.ID === selectedIds[0]);


                    if (!selectedReader) return null;

                    switch (selectedReader.Status) {
                      case "Pending":
                        return (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleApprove(selectedReader.ID)}
                              sx={{ mr: 1 }}
                            >
                              {translations.action.accept}
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleReject(selectedReader.ID)}
                              sx={{ mr: 1 }}
                            >
                              {translations.action.reject}
                            </Button>
                          </>
                        );
                      case "Accepted":
                        return (
                          <Button
                            variant="contained"
                            color="error"
                            // onClick={() => handleDelete(selectedReader.ID)}
                            onClick={() => setisDialogOpen(true)}
                          >
                            {translations.action.delete}
                          </Button>
                        );
                      case "Rejected":
                        return (
                          <Button
                            variant="contained"
                            color="success"
                            // onClick={() => handleApprove(selectedReader.ID)}
                            disabled
                          >
                            {translations.notification.soondelete}
                          </Button>
                        );
                      case "Deleted":
                        return (
                          <Button
                            variant="contained"
                            color="success"
                            // onClick={() => handleApprove(selectedReader.ID)}
                            disabled
                          >
                            {translations.notification.soondelete}
                          </Button>
                        );
                      default:
                        return null;
                    }
                  })()}

                  {/* Multiple selection */}
                  {selectedIds.length > 1 && (() => {
                    const selectedReaders = filteredReaders.filter(r => selectedIds.includes(r.ID));
                    if (selectedReaders.length === 0) return null;

                    const allSameStatus = selectedReaders.every(r => r.Status === selectedReaders[0].Status);
                    if (!allSameStatus) return null;

                    switch (selectedReaders[0].Status) {
                      case "Pending":
                        return (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={handleApproveAll}
                              sx={{ mr: 1 }}
                            >
                              {translations.action.acceptAll}
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={handleRejectAll}
                            >
                              {translations.action.rejectAll}
                            </Button>
                          </>
                        );
                      case "Accepted":
                        return (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => setMultipleisDialogOpen(true)}
                          >
                            {translations.action.deleteAll}
                          </Button>
                        );
                      default:
                        return null;
                    }
                  })()}
                </>
              )}
            </Toolbar>
          )}





          {/* Toggle button */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
            <Badge color="primary" variant="dot" invisible={!Object.values(filters).some((v) => v)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <Button
                variant="outlined"
                startIcon={showFilters ? <FilterAltOff /> : <FilterAlt />}

                onClick={() => setShowFilters((prev) => !prev)}
              >

                {showFilters ? translations.filter.hide : translations.filter.show}

              </Button>
            </Badge>

          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />



        {/* Filter Section */}
        {
          showFilters &&
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            {readersColumns.map(({ id, label, type }) => {
              const fieldValues = readers.map((row) => row[id as keyof typeof row]).filter(Boolean);
              const uniqueValues = Array.from(new Set(fieldValues));

              return (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    flexBasis: "calc(25% - 16px)",
                    flexGrow: 0,
                    width: "calc(25% - 16px)",
                  }}
                >
                  {

                    type === "status" ? (
                      <FormControl size="small" fullWidth>
                        <InputLabel>{label}</InputLabel>
                        <Select
                          multiple
                          label={label}
                          value={filters[id] ?? []}
                          onChange={(e: any) => setFilters({ ...filters, [id]: e.target.value })}
                          renderValue={(selected: any) => (selected as string[]).join(", ")}
                        >
                          {["Pending", "Accepted", "Rejected"].map((option) => (
                            <MenuItem key={option} value={option}>
                              <Checkbox checked={(filters[id] ?? []).includes(option)} />
                              <ListItemText primary={option} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) :
                      type === "multiselect" ? (
                        <FormControl size="small" fullWidth>
                          <InputLabel>{label}</InputLabel>
                          <Select
                            multiple
                            label={label}
                            value={filters[id] ?? []}
                            onChange={(e: any) =>
                              setFilters({ ...filters, [id]: e.target.value })
                            }
                            renderValue={(selected: any) => (selected as string[]).join(", ")}
                          >
                            {uniqueValues.map((val) => (
                              <MenuItem key={val} value={val}>
                                <Checkbox checked={(filters[id] ?? []).includes(val)} />
                                <ListItemText primary={val} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : type === "user" ? (
                        <FormControl size="small" fullWidth>
                          <InputLabel>{label}</InputLabel>
                          <Select
                            label={label}
                            value={filters[id] ?? ""}
                            onChange={(e: any) =>
                              setFilters({ ...filters, [id]: e.target.value })
                            }
                          >
                            <MenuItem value="">
                              <em>All</em>
                            </MenuItem>
                            {uniqueValues.map((email) => (
                              <MenuItem key={email} value={email}>
                                {email}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          size="small"
                          label={label}
                          variant="outlined"
                          fullWidth
                          value={filters[id] ?? ""}
                          onChange={(e: any) =>
                            setFilters({ ...filters, [id]: e.target.value })
                          }
                        />
                      )}
                </Box>
              );
            })}

            <Button
              variant="outlined"
              onClick={() => setFilters({})}
              startIcon={<RestartAlt />}
              sx={{ height: "40px" }}
            >
              {translations.action.reset}
            </Button>
          </Box>
        }


      </Box>









      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="contributors table">
          <TableHead>
            <TableRow>

              <TableCell padding="checkbox">

                <Checkbox
                  checked={
                    filteredReaders.filter((r) => r.Status !== "Rejected" && r.Status !== "Deleted").length > 0 &&
                    selectedIds.length === filteredReaders.filter((r) => r.Status !== "Rejected" && r.Status !== "Deleted").length
                  }
                  indeterminate={
                    selectedIds.length > 0 &&
                    selectedIds.length < filteredReaders.filter((r) => r.Status !== "Rejected" && r.Status !== "Deleted").length
                  }
                  onChange={(e: any) => {
                    if (e.target.checked) {
                      setSelectedIds(
                        filteredReaders
                          .filter((reader) => reader.Status !== "Rejected" && reader.Status !== "Deleted")
                          .map((reader) => reader.ID)
                      );
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />

              </TableCell>
              {readersColumns.map((column) => (

                <TableCell sx={{ fontWeight: "bold" }} key={column.id}>
                  <Box
                    sx={{
                      // padding: "6px",
                      // textAlign: "center",
                      width: columnSizeMapping[column.id] || columnWidths.small,
                    }}
                  >
                    {column.label}
                  </Box>
                </TableCell>
              ))}


              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReaders.map((reader) => (
              <TableRow key={reader.ID}
                sx={{
                  opacity: reader.Status === "Rejected" || reader.Status === "Deleted" ? 0.5 : 1,
                  pointerEvents: reader.Status === "Rejected" || reader.Status === "Deleted" ? "none" : "auto",
                }}

              >
                <TableCell padding="checkbox">
                  <Checkbox
                    disabled={reader.status === "Rejected" || reader.status === "Deleted"}
                    checked={selectedIds.includes(reader.ID)}
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        setSelectedIds((prev) => [...prev, reader.ID]);
                      } else {
                        setSelectedIds((prev) => prev.filter((id) => id !== reader.ID));
                      }
                    }}
                  />
                </TableCell>



                <TableCell>{reader.FullName}</TableCell>
                <TableCell>{reader.Email}</TableCell>
                <TableCell>
                  <Chip
                    label={reader.Status === "Pending" ? `${translations.status.pending}` : reader.Status === "Accepted" ? `${translations.status.accepted}` : reader.Status === "Rejected" ? `${translations.status.rejected}` : `${translations.status.deleted}`}
                    color={reader.Status === "Pending" ? "primary" : reader.Status === "Accepted" ? "success" : reader.Status === "Rejected" ? "error" : "default"}
                    size="medium"
                  // variant="contained"
                  />
                </TableCell>
                <TableCell>{reader.Partner}</TableCell>
                <TableCell>{reader.FocalPointMail}</TableCell>


                <TableCell>{reader.Title}</TableCell>
                <TableCell>{reader.Organization}</TableCell>
                <TableCell>{reader.Department}</TableCell>
                <TableCell>{reader.RequestReason}</TableCell>


                <TableCell>
                  {reader.Status === "Pending" ? (
                    <Box sx={{ display: "flex", gap: 2, }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() => handleApprove(reader.ID)}
                      >
                        {translations.action.accept}
                        {/* accept */}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleReject(reader.ID)}
                      >
                        {translations.action.reject}
                        {/* reject */}
                      </Button>
                    </Box>
                  ) :

                    reader.Status === "Accepted"
                      ?
                      (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => setisDialogOpen(true)}
                          >
                            {translations.action.delete}
                            {/* reject */}
                          </Button>
                          <Dialog open={isDialogOpen} onClose={() => { setisDialogOpen(false) }}>
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
                              <DialogTitle><Typography>{translations.action.delete}</Typography></DialogTitle>
                              <DialogContent>
                                <Typography>{translations.card.areYouSure}</Typography>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => { setisDialogOpen(false) }} color="primary">
                                  {translations.action.cancel}
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleDelete(reader.ID)
                                      .then(() => setisDialogOpen(false))
                                      .catch((err) => console.error(err));
                                  }}
                                  color="warning">
                                  {translations.action.delete}
                                </Button>
                              </DialogActions>
                            </div>
                          </Dialog>
                        </>
                      )
                      :
                      (

                        <>
                          <Chip
                            label={translations.status.soon}
                            color={"default"}
                          />
                        </>
                      )


                  }
                </TableCell>



              </TableRow>
            ))}
          </TableBody>


        </Table>
      </TableContainer>

      <AssignToFocalPoint
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        onAssign={handleAssign}
        readerIds={selectedIds}
      />



      <ConfirmationDialog
        open={isMultipleDialogOpen}
        onClose={() => { setMultipleisDialogOpen(false) }}
        onConfirm={handleDeleteAll}
        loading={loading}
      />






      {/* <Notification notify={notification} onClose={handleNotificationClose} /> */}
    </div>
  );


}

export default RedersJvap;
