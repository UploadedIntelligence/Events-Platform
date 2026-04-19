import { Outlet } from 'react-router';
import { Header } from '../../components/header/header.tsx';
import { useState } from 'react';
import { Dashboard } from '../../components/dashboard/dashboard.tsx';
import { MainBackground } from '../../components/main-background/main-background.tsx';
import { EpFooter } from '../../components/footer/footer.tsx';
import { EpPageContent } from '../../components/page-content/page-content.tsx';
import { EpButton } from '../../components/button/button.tsx';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useLoaderData } from 'react-router-dom';
import type { IUser } from '../../utilities/user-permissions.ts';

export function LandingPage() {
    const { user }: { user: IUser } = useLoaderData();
    const [isVisible, setIsVisible] = useState<boolean>(true);

    return (
        <MainBackground>
            <Header>
                <EpButton variant="ghost" onClick={() => setIsVisible(!isVisible)}>
                    <EventAvailableIcon
                        sx={{
                            color: 'white',
                            background: '#0d7ff2',
                            borderRadius: '4px',
                            padding: '2px',
                            fontSize: '1.5em',
                        }}
                    />
                    {user ? 'Dashboard' : ''}
                </EpButton>
            </Header>
            {isVisible && user && <Dashboard />}
            <EpPageContent>
                <Outlet />
            </EpPageContent>
            <EpFooter />
        </MainBackground>
    );
}
