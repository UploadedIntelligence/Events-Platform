import { EpButton } from '../../components/button/button.tsx';
import { EpHeaderNavLink } from '../../components/header-navlink/header-navlink.tsx';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { EpPageContent } from '../../components/page-content/page-content.tsx';
import { Outlet } from 'react-router';
import { EpFooter } from '../../components/footer/footer.tsx';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { routePaths } from '../../routes.ts';

export function GuestLandingPage() {
    const today = dayjs().format('YYYY-MM-DD-HH');
    const navigate = useNavigate();

    return (
        <>
            <div className="EpHeader">
                <div className="EpHeader-dashboardButton">
                    <EpButton variant="ghost">
                        <EventAvailableIcon
                            sx={{
                                color: 'white',
                                background: '#0d7ff2',
                                borderRadius: '4px',
                                padding: '2px',
                                fontSize: '1.5em',
                            }}
                        />
                    </EpButton>
                </div>
                <div className="EpHeader-option">
                    <EpHeaderNavLink to={{ pathname: routePaths.events.path, search: `fromDate=${today}` }}>
                        Events
                    </EpHeaderNavLink>
                    <div className="EpHeader-option--positionRight">
                        <EpButton onClick={() => navigate(routePaths.login.path)}>Sign In</EpButton>
                        <EpButton onClick={() => navigate(routePaths.register.path)}>Sign Up</EpButton>
                    </div>
                </div>
            </div>
            <EpPageContent>
                <Outlet />
            </EpPageContent>
            <EpFooter />
        </>
    );
}
