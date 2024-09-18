import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'DataverseTasksWebPartStrings';
import DataverseTasks from './components/DataverseTasks';
import { IDataverseTasksProps } from './components/IDataverseTasksProps';
import { DataverseContextProvider } from "mgwdev-dataverse-tasks/lib/context/DataverseContext";
import { AuthenticationContextProvider } from "mgwdev-dataverse-tasks/lib/context/AuthenticationContext";
import { GraphContextProvider } from "mgwdev-dataverse-tasks/lib/context/GraphContext";
import { AadTokenProvider } from '@microsoft/sp-http';

export interface IDataverseTasksWebPartProps {
  description: string;
}

const dataverseUri = "https://contoso.crm4.dynamics.com"


export default class DataverseTasksWebPart extends BaseClientSideWebPart<IDataverseTasksWebPartProps> {

  private tokenProvider: AadTokenProvider;

  public render(): void {
    const element: React.ReactElement<IDataverseTasksProps> = React.createElement(
      DataverseTasks,
      {
      }
    );

    const dataverseContextProvider = React.createElement(DataverseContextProvider, {
      dataverseResource: dataverseUri
    }, element);

    const graphContextProvider = React.createElement(GraphContextProvider, {
    }, dataverseContextProvider);
    
    const authContextProvider = React.createElement(AuthenticationContextProvider, {
      authProvider: {
        getAccessToken: async (resource) => {
          return await this.tokenProvider.getToken(resource)
        }
      }
    }, graphContextProvider)
    ReactDom.render(authContextProvider, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this.tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();

  }


  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
