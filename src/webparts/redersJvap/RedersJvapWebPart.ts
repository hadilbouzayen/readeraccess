import * as React from 'react';
import * as ReactDom from 'react-dom';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { LanguageProvider } from '../services/LanguageContext';
import { getSP } from '../config/pnpConfig';
import RedersJvap from './components/RedersJvap';
import { filterFocalPointList, getCurrentUser, isCurrentUserInSPGroupById } from '../services/sharepointService';


export interface IRedersJvapWebPartProps {

}

export default class RedersJvapWebPart extends BaseClientSideWebPart<IRedersJvapWebPartProps> {

  private isAdmin: boolean = false;
  private isFocalPoint: boolean = false;
  private currentUser: any = null;


  protected async onInit(): Promise<void> {
    // Initialize the SharePoint context
    getSP(this.context);

    this.currentUser = await getCurrentUser();
    const isInAdminGroup = await isCurrentUserInSPGroupById(3);


    if (isInAdminGroup) {
      this.isAdmin = true;
      this.isFocalPoint = false;
    } else {
      const focalPoint = await filterFocalPointList(this.currentUser?.Email);
      if (focalPoint) {
        this.isAdmin = false;
        this.isFocalPoint = true;
      } else {
        this.isAdmin = false;
        this.isFocalPoint = false;
      }
    }
  }
  public render(): void {
    const siteLanguage = this.context.pageContext.cultureInfo.currentUICultureName.split('-')[0]; // Get language code (en, fr, etc.)



    const element: React.ReactElement = React.createElement(
      LanguageProvider, // 👈 wrap your app here
      null,
      React.createElement(RedersJvap, { siteLanguage: siteLanguage, isAdmin: this.isAdmin, isFocalPoint: this.isFocalPoint, currentUser: this.currentUser })
    );

    ReactDom.render(element, this.domElement);
  }
}
