import { ISiteUserInfo } from "@pnp/sp/site-users";

export interface IRedersJvapProps {
  siteLanguage: string;
  isAdmin: boolean;
  isFocalPoint: boolean;
  currentUser: ISiteUserInfo;
}
