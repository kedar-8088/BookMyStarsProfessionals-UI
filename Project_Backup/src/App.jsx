import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#69247C',
    },
    secondary: {
      main: '#DA498D',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

