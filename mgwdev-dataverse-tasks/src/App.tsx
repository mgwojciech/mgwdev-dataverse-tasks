import * as React from 'react';
import { Msal2AuthenticationService } from 'mgwdev-m365-helpers/lib/services/Msal2AuthenticationService'
import { AuthenticationContextProvider } from './context/AuthenticationContext'
import { GraphContextProvider } from './context/GraphContext'
import { DataverseContextProvider } from './context/DataverseContext'
import { TasksList } from './components/TasksList'
import { PartialTheme, ThemeProvider } from '@fluentui/react'

const theme: PartialTheme = {
  palette: {
    themePrimary: '#0f8387',
    themeDark: '#324c4d',
  },
};
function App() {
  const clientId = import.meta.env.VITE_FRONTEND_CLIENT_ID
  const dataverseResource = import.meta.env.VITE_DATAVERSE_ENV
  const tenantId: string = import.meta.env.VITE_FRONTEND_TENANT_ID
  const authService = new Msal2AuthenticationService({ clientId: clientId, tenantId: tenantId }, false);

  return (<ThemeProvider theme={theme}>
    <AuthenticationContextProvider authProvider={authService}>
      <GraphContextProvider>
        <DataverseContextProvider dataverseResource={dataverseResource}>
          <TasksList />
        </DataverseContextProvider>
      </GraphContextProvider>
    </AuthenticationContextProvider>
  </ThemeProvider>
  )
}

export default App
