// en.js

export const card = {
  AddContributor: "Add Contributor",
  Titleisrequired: "Title is required.",
  FullNameisrequired: "Full Name is required.",
  Emailisrequired: "Email is required.",
  ValidMail: "Please enter a valid email address.",
  Organizationisrequired: "Organization is required.",

  areYouSure: "Are you sure you want to delete this/these item(s)",
  EditContributor: "Edit Contributor",
  accessDinied: "Access Denied: You do not have the required permissions.",
  Purpose: "This page is for the management of persons who have requested access to the JVAP Data Browser or Dashboard. Granting approval does not give them access to the data collection site or any unpublished data. You may remove access at any time.",
  FullName: "Full Name",
  Partner: "Partner",
  Role: "Role",
  RoleCont: "Contributor",
  RoleFocal: "Focal Point",
  // Email: "Email", // Already exists as Emailisrequired? No, lint says Email missing on type. Wait. Emailisrequired is there. Email is NOT.
  Email: "Email",
  Organisation: "Organisation",
  FocalPoint: "Focal Point",
  contributors: "Contributors",
  notifyFocal: "Notify Focal Point",
  notifyJVAP: "Notify JVAP",
  instructions: "Instructions",
  PendingInitiatives: "Pending Initiatives",
  RejectedInitiatives: "Rejected Initiatives",
  ApprovedInitiatives: "Approved Initiatives",
  PendingReaders: "Pending Readers",
  RejectedReaders: "Rejected Readers",
  ApprovedReaders: "Approved Readers",
};

export const action = {
  addNew: "Add New Contributor",
  delete: "Delete",
  edit: "Edit",
  back: "Back",
  save: "Save",
  cancel: "Cancel",
  reject: "Reject",
  accept: "Accept",
  assign: "Assign to Focal Point",
  rejectAll: "Reject all",
  acceptAll: "Accept all",
  deleteAll: "Delete all",
  reset: "Reset",

};

export const filter = {
  filterBy: "Filter by Column",
  filter: "Filter",

  hide: "Hide filters",
  show: "show filters",
  reset: "reset filters",

  options: {
    none: "None",
    SelectUser: "SelectUser",
    All: "All"
  }
};

export const dateFilter = {
  selectRange: "Select range",
  None: "None",
  Customrange: "Custom range",
  Today: "Today",
  Lastweek: "Last week",
  Lastmonth: "Last month",
  Thisyear: "This year",
  From: "From",
  To: "To",
};



export const TableColumn = {
  Name: "Name",
  Title: "Title",
  FullName: "Full Name",
  Email: "Email",
  Organisation: "Organisation",
  FocalPointEmail: "Focal Point Email",
  Reason: "Reason",
  Department: "Department",
  Partner: "Partner",
  JobTitle: "Job Title",
  SubmissionFinished: "Status",

};


export const AssigntoFocalPoint = {
  AssigntoFocalPoint: "Assign to Focal Point",
  NoReder: "No reader is selected.",
  serchfocal: "Search Focal Point",
  cancel: "Cancel",
  assign: "Assign",
  you: "You are going to assign",
  reader: "reader",
  tofp: "to a focal point"

};



export const status = {
  yes: "Yes",
  no: "No",
  rejected: "Rejected",
  accepted: "Accepted",
  pending: "Pending",
  deleted: "Deleted",
  soon: "This element will be deleted soon"
};

export const notification = {
  soondelete: "This element will be soon deleted",
  approveSuccess: "Reader approved successfully.",
  approveFailed: "Failed to approve reader.",

  approveallsuccess: "All selected readers approved successfully.",
  approveallfailed: "Failed to approve all selected readers.",


  Rejectsuccess: "Reader rejected successfully.",
  RejectFailed: "Failed to reject reader.",

  RejectAllsuccess: "All selected readers rejected successfully.",
  RejectAllFailed: "Failed to reject all selected readers.",



  deleteSuccess: "Reader deleted successfully.",
  deleteFailed: "Failed to delete reader.",

  deleteAllSuccess: "All selected readers deleted successfully.",
  deleteAllFailed: "Failed to delete all selected readers.",

  assignSuccess: "Assigned to focal point successfully",
  assignFailed: "Failed to assign to focal point."
};
