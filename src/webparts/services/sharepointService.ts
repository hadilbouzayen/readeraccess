import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-users";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import "@pnp/sp/site-users/web";
import { getSP } from "../config/pnpConfig";

import "@pnp/sp/sputilities";

import { ISiteUserInfo } from "@pnp/sp/site-users/types";


export interface IResponseItem {
  [key: string]: any;
}

export interface IListItem {
  [key: string]: any;
}

// export const getCurrentCampaign = async (): Promise<any> => {
//   const _sp: SPFI = getSP();

//   try {
//     const results = await _sp.web.lists
//       .getByTitle("Campaigns")
//       .items.select("*")
//       .orderBy("field_2", false) // Order by 'field_2' (start date) in descending order (most recent first)
//       .top(1)(); // Limit to 1 result, the latest campaign
//     return results.length > 0 ? results[0] : null; // Return the latest campaign or null if none found
//   } catch (error) {
//     console.error("Error fetching Campaign:", error);
//     throw error;
//   }
// };

// Filter the FocalPointList by user email
export const filterFocalPointList = async (email: string): Promise<any> => {
  const _sp: SPFI = getSP();
  try {
    const results = await _sp.web.lists
      .getByTitle("Focal Point")
      .items.filter(`Email eq '${email}'`)
      .select("Id", "Title", "Email", "Country", "Organisation")();

    return results.length > 0 ? results[0] : null; // Return the first match or null if not found
  } catch (error) {
    console.error("Error fetching Focal Point:", error);
    throw error;
  }
};


export const getAllFocalPoints = async (): Promise<any[]> => {
  const _sp: SPFI = getSP();
  try {
    // Fetch all fields for debugging purposes
    const results = await _sp.web.lists
      .getByTitle("FocalPointList")
      .items();

    console.log("All Focal Points Fields:", results);

    return results;
  } catch (error) {
    console.error("Error fetching all focal points:", error);
    throw error;
  }
};

// Filter the ContrebutorList by user email
// export const filterContrebutorList = async (email: string): Promise<any> => {
//   const _sp: SPFI = getSP();

//   try {
//     const results = await _sp.web.lists
//       .getByTitle("Contributor")
//       .items.filter(`Email eq '${email}'`)
//       .select(
//         "Id",
//         "Email",
//         "Title",
//         "field_1",
//         "Organisation",
//         "FocalPointRef/Id",
//         "FocalPointRef/Title",
//         "FocalPointRef/Country",
//         "FocalPointRef/Email"
//       )
//       .expand("FocalPointRef")
//       .top(5000)();

//     return results.length > 0 ? results[0] : null; // Return the first match or null if not found
//   } catch (error) {
//     console.error("Error fetching Contributor:", error);
//     throw error;
//   }
// };

// createItem function
// export const createItem = async (
//   data: Record<string, any>
// ): Promise<{ Id: number } | null> => {
//   const _sp: SPFI = getSP();
//   try {
//     const response = await _sp.web.lists
//       .getByTitle("Contributor")
//       .items.add(data);
//     return response;
//   } catch (err) {
//     console.error(`Error creating item in list ${"Contributor"}:`, err);
//     return null; // Return null if item creation failed
//   }
// };

// export const updateItem = async (
//   itemId: number,
//   data: object
// ): Promise<Record<string, any> | null> => {
//   try {
//     const _sp: SPFI = getSP();
//     await _sp.web.lists
//       .getByTitle("Contributor")
//       .items.getById(itemId)
//       .update(data);

//     // Retrieve the updated item
//     const updatedItem = await _sp.web.lists
//       .getByTitle("Contributor")
//       .items.getById(itemId)
//       .select("*")();
//     return updatedItem; // Returning the updated item data
//   } catch (error) {
//     console.error("Error updating item:", error);
//     return null; // Return null if the update fails
//   }
// };

// export const deleteItem = async (itemId: number): Promise<void> => {
//   const _sp: SPFI = getSP();
//   try {
//     await _sp.web.lists
//       .getByTitle("Contributor")
//       .items.getById(itemId)
//       .delete();
//   } catch (err) {
//     console.error(
//       `Error deleting item with ID ${itemId} from list Contributor:`,
//       err
//     );
//     throw err;
//   }
// };




export const getAllReaders = async (userEmail: string, isFP: boolean, isAdmin: boolean): Promise<any[]> => {
  const _sp: SPFI = getSP();
  try {
    let query = "";

    if (isFP && !isAdmin) {
      query = `FocalPointMail eq '${userEmail}'`;
    }

    let items = _sp.web.lists
      .getByTitle("ReaderAccessRequest")
      .items.select(
        "ID",
        "Email",
        "Title",
        "FullName",
        "Organization",
        "RequestReason",
        "Status",
        "FocalPointMail",
        "Partner",
        "Department"
      )
      .top(5000);

    if (query) {
      items = items.filter(query);
    }

    const results = await items();
    return results;
  } catch (error) {
    console.error("Error fetching readers:", error);
    return [];
  }
};


export const getCurrentUser = async (): Promise<ISiteUserInfo> => {
  const _sp: SPFI = getSP();
  try {
    return _sp.web.currentUser();
  } catch (err) {
    console.error("Error retrieving current user", err);
    throw err;
  }
};

// Function to get the Focal Point's details using the FocalPointRefId
export const getFocalPointDetails = async (
  focalPointRefId: number
): Promise<any> => {
  const _sp: SPFI = getSP();
  try {
    const focalPoint = await _sp.web.lists
      .getByTitle("Focal Point") // Replace with your actual Focal Point list name
      .items.getById(focalPointRefId)
      .select("Email", "Title", "Country"); // Adjust as necessary

    return focalPoint;
  } catch (error) {
    console.error("Error fetching Focal Point details:", error);
    throw error;
  }
};


export const isCurrentUserInSPGroupById = async (groupId: number): Promise<boolean> => {
  const _sp: SPFI = getSP();
  try {
    // Get the current user
    const currentUser = await _sp.web.currentUser();
    // Get the group by ID
    // const group = await _sp.web.siteGroups.getById(groupId)();
    // Get the users in the group
    const usersInGroup = await _sp.web.siteGroups.getById(groupId).users();
    // Check if the current user is in the group
    return usersInGroup.some(user => user.Id === currentUser.Id);
  } catch (error) {
    console.error("Error checking group membership:", error);
    return false;
  }
};


export const assignFocalPointToReaders = async (
  readerIds: number[],
  focalPointEmail: string
): Promise<void> => {
  const _sp: SPFI = getSP();

  try {
    await Promise.all(
      readerIds.map(async (id) => {
        await _sp.web.lists
          .getByTitle("ReaderAccessRequest")
          .items.getById(id)
          .update({
            FocalPointMail: focalPointEmail,
          });
      })
    );
    // console.log("Successfully assigned focal point to selected readers.");
  } catch (error) {
    console.error("Error assigning focal point to readers:", error);
    throw error;
  }
};

export const acceptReaders = async (readerIds: number[]): Promise<void> => {
  const _sp: SPFI = getSP();

  try {
    await Promise.all(
      readerIds.map(async (id) => {
        await _sp.web.lists
          .getByTitle("ReaderAccessRequest")
          .items.getById(id)
          .update({
            Status: "Accepted",
          });
      })
    );
    // console.log("Readers accepted successfully.");
  } catch (error) {
    console.error("Error accepting readers:", error);
    throw error;
  }
};


export const rejectReaders = async (readerIds: number[]): Promise<void> => {
  const _sp: SPFI = getSP();

  try {
    await Promise.all(
      readerIds.map(async (id) => {
        await _sp.web.lists
          .getByTitle("ReaderAccessRequest")
          .items.getById(id)
          .update({
            Status: "Rejected",
          });
      })
    );
    // console.log("Readers rejected successfully.");
  } catch (error) {
    console.error("Error rejecting readers:", error);
    throw error;
  }
};

export const deleteReaders = async (readerIds: number[]): Promise<void> => {
  const _sp: SPFI = getSP();

  try {
    await Promise.all(
      readerIds.map(async (id) => {
        await _sp.web.lists
          .getByTitle("ReaderAccessRequest")
          .items.getById(id)
          .update({
            Status: "Deleted",
          });
      })
    );
    // console.log("Readers rejected successfully.");
  } catch (error) {
    console.error("Error deleting readers:", error);
    throw error;
  }
};

