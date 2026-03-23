import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './login.tsx';
import { RegisterPage } from './register.tsx';
import { UserLandingPage } from './user-landing-page';
import { Header } from '../../components/header/header.tsx';
import { useState } from 'react';
import { Dashboard } from '../../components/dashboard/dashboard.tsx';
import { MainBackground } from '../../components/main-background/main-background.tsx';
import { EpFooter } from '../../components/footer/footer.tsx';

export function LandingPage() {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    return (
        <MainBackground>
            <Header isVisible={isVisible} setIsVisible={setIsVisible} />
            {isVisible && <Dashboard />}
            <Routes>
                <Route path="/*" element={<UserLandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
            <EpFooter />
        </MainBackground>
    );
}
