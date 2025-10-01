import './App.css';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login.tsx';
import { UserAuthenticated } from './pages/user-authenticated.tsx';

function App() {
    return (
        <>
            <h1>Events Platform</h1>

            <Routes>
                <Route path="/user/login" element={<LoginPage />} />
                <Route path="*" element={<UserAuthenticated />} />
            </Routes>
        </>
    );
}

export default App;
