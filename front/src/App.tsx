import authClient from './services/auth-client.ts';
import { CssBaseline } from '@mui/material';
import { LandingPage } from './pages/landing-page';
import { Spinner } from './components/spinner/spinner.tsx';

export function App() {
    const { isPending } = authClient.useSession();
    if (isPending) {
        return <Spinner />;
    }

    return (
        <>
            <CssBaseline />
            <LandingPage />
        </>
    );
}
