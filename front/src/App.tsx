import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/login.tsx';
import { Button, createTheme, ThemeProvider } from '@mui/material';
import { green, red } from '@mui/material/colors';
import authClient from './services/auth-client.ts';
import { RegisterPage } from './pages/register.tsx';
import { Spinner } from './pages/loading.tsx';
import { CreateEventPage } from './pages/create-event.tsx';
import { NavBar } from './components/nav-bar.tsx';
import { UserSettings } from './components/user-settings.tsx';

function App() {
    const { data, isPending } = authClient.useSession();
    const navigate = useNavigate();
    const location = useLocation();
    console.log(data);
    if (isPending) {
        return <Spinner />;
    }

    async function googleSignIn() {
        const { error } = await authClient.signIn.social({
            provider: 'google',
            callbackURL: 'https://clinquant-medovik-161e95.netlify.app',
            errorCallbackURL: 'https://clinquant-medovik-161e95.netlify.app',
            // can be added via authClien.linkSocial to ask user for calendar permission
            // rather than having it automatically when signed in via Google account
            scopes: ['https://www.googleapis.com/auth/calendar.events'],
        });
        if (error) {
            console.log('signIn Error:', error);
        }
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
            {data && <NavBar />}
            <Routes>
                <Route path="*" element={<LoginPage />} />
                <Route path="/user/register" element={<RegisterPage />} />
                <Route path="/create-event" element={<CreateEventPage />} />
                <Route path="/user-settings" element={<UserSettings />} />
            </Routes>
            {!data && (
                <div className="register">
                    <Button onClick={googleSignIn}>Google Signup/Login</Button>
                    {location.pathname !== '/user/register' && (
                        <Button onClick={() => navigate('/user/register')}>Register</Button>
                    )}
                    {location.pathname !== '/' && <Button onClick={() => navigate('/')}>Login with password</Button>}
                </div>
            )}
        </ThemeProvider>
    );
}

export default App;
