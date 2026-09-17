import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e5139',
      dark: '#112f21',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#112f21',
      secondary: '#486859',
      disabled: '#9ebdae',
    },
    divider: '#e2efe9',
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: '32px',
      letterSpacing: '-0.24px',
      color: '#112f21',
    },
    body1: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '22px',
      color: '#486859',
    },
    body2: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: '16px',
      color: '#9ebdae',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: '#e2efe9',
          },
        },
        input: {
          padding: '11px 12px',
          fontSize: 14,
          '&::placeholder': {
            color: '#9ebdae',
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
