import '../../App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './login.tsx';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { red, grey } from '@mui/material/colors';
import authClient from '../../services/auth-client.ts';
import { RegisterPage } from './register.tsx';
import { Spinner } from '../../components/loading.tsx';
import { UserLandingPage } from './user-landing-page';

function LandingPage() {
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
                    variant: 'outlined',
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
        },
    });

    if (isPending) {
        return <Spinner />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <h1>Events Platform</h1>
            <Routes>
                <Route path="/*" element={<UserLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default LandingPage;
