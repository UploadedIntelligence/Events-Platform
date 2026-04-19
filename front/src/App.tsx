import authClient from './services/auth-client.ts';
import { Spinner } from './components/spinner/spinner.tsx';
import { Outlet } from 'react-router';

export function App() {
    const { isPending } = authClient.useSession();
    if (isPending) {
        return <Spinner />;
    }

    return <Outlet />;
}
