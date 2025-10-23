import './App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import { green, red } from '@mui/material/colors';
import authClient from './services/auth-client.ts';
import { RegisterPage } from './pages/register.tsx';
import { Spinner } from './pages/loading.tsx';
import { UserLandingPage } from './components/user-landing-page.tsx';
import { UserSettings } from './components/user-settings.tsx';

function App() {
    const { isPending } = authClient.useSession();


    if (isPending) {
        return <Spinner />;
    }



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
    return (
        <ThemeProvider theme={theme}>
            <h1>Events Platform</h1>
            <Routes>
                <Route path="/*" element={<UserLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
