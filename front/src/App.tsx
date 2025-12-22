import authClient from './services/auth-client.ts';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { grey, red } from '@mui/material/colors';
import { LandingPage } from './pages/landing-page';
import { Spinner } from './components/loading.tsx';

export function App() {
    const { isPending } = authClient.useSession();
    const userTheme: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = createTheme({
        palette: {
            mode: userTheme ? 'dark' : 'light',
            primary: {
                main: grey[600],
            },
            secondary: {
                main: red[500],
            },
        },
        components: {
            MuiButton: {
                defaultProps: {
                    variant: 'contained',
                },
                styleOverrides: {
                    root: {
                        fontWeight: '600',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: 'inherit',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        background: userTheme ? '#121412' : '#e4e4e4',
                    },
                },
            },
            MuiFormControl: {
                styleOverrides: {
                    root: {
                        background: userTheme ? '#121412' : '#e4e4e4',
                    },
                },
            },
        },
    });

    if (isPending) {
        return <Spinner />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LandingPage />
        </ThemeProvider>
    );
}
