import '../../App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './login.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import { green, red } from '@mui/material/colors';
import authClient from '../../services/auth-client.ts';
import { RegisterPage } from './register.tsx';
import { Spinner } from '../../components/loading.tsx';
import { UserLandingPage } from './user-landing-page';

function LandingPage() {
    const { isPending } = authClient.useSession();

    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: green[700],
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
        },
    });

    if (isPending) {
        return <Spinner />;
    }

    return (
        <ThemeProvider theme={theme}>
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
