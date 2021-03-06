import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import AppContextProvider from './contexts/AppContextProvider';
import Login from './components/Login';
import Layout from './components/Layout';
import AuthRoute from './components/AuthRoute';

const THEME = createMuiTheme({
  typography: {
    "fontFamily": "Roboto, Helvetica, Microsoft JhengHei",
  },
  overrides: {
    MuiDialogContentText: {
      root: {
        color: '#757575'
      }
    },
    MuiDialogTitle: {
      root: {
        color: '#03a9f4'
      }
    },
    MuiList: {
      root: {
        margin: '8px'
      }
    },
    MuiListItem: {
      root: {
        color: '#757575',
        '&$focusVisible': {
          backgroundColor: '#fff'
        },
        '&$selected, &$selected:hover': {
          color: '#03a9f4',
          backgroundColor: '#fff'
        }
      },
      button: {
        borderRadius: '25px',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'unset'
      }
    },
    MuiTouchRipple: {
      root: {
        color: 'rgba(0, 0, 0, 0.54)'
      }
    }
  }
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={THEME}>
        <AppContextProvider>
          <Switch>
            <Route exact path="/login" component={Login}></Route>
            <AuthRoute path="/" component={Layout}></AuthRoute>
          </Switch>
        </AppContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
