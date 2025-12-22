import '../../App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './login.tsx';
import { RegisterPage } from './register.tsx';
import { UserLandingPage } from './user-landing-page';
import { Paper } from '@mui/material';

export function LandingPage() {
    return (
        <Paper>
            <h1>Events Platform</h1>
            <Routes>
                <Route path="/*" element={<UserLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Paper>
    );
}
