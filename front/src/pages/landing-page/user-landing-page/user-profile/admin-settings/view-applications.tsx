import type { Application } from './index.tsx';
import axios from '../../../../../config/client.ts';
import { ApplicationTable } from '../../../../../components/application-table.tsx';
import { Spinner } from '../../../../../components/spinner/spinner.tsx';
import { useQuery } from '@tanstack/react-query';
import { getSession, type IUser } from '../../../../../utilities/user-permissions.ts';

export function ViewApplications() {
    const user: IUser | undefined = getSession();

    if (user?.role !== 'admin') {
        return <div>Forbidden</div>;
    }

    const { data, isPending, error } = useQuery({
            queryKey: ['applications'],
            queryFn: () => {
                return axios.get<Array<Application>>('/applications');
            },
        }),
        applications = data?.data?.map((application: Application) => {
            return {
                userEmail: application.userEmail,
                status: application.status,
                role: application.role,
            };
        });

    if (isPending) {
        return <Spinner />;
    } else if (error) {
        return <>Something went wrong</>;
    }

    return <ApplicationTable applications={applications} />;
}
