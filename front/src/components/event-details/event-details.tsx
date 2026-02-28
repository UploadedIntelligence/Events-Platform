import './event-details.scss';
export function EpEventDetails() {
    return (
        <>
            {/*{event.actions?.map((action, index) => {*/}
            {/*    if (action !== null) {*/}
            {/*        return (*/}
            {/*            <Button*/}
            {/*                key={index}*/}
            {/*                color={*/}
            {/*                    action.type === '/attending'*/}
            {/*                        ? 'error'*/}
            {/*                        : action.type === 'additional information'*/}
            {/*                            ? 'info'*/}
            {/*                            : 'success'*/}
            {/*                }*/}
            {/*                variant={action.type === 'additional information' ? 'outlined' : 'contained'}*/}
            {/*                size="small"*/}
            {/*                onClick={() => action?.action()}*/}
            {/*            >*/}
            {/*                {action.title}*/}
            {/*            </Button>*/}
            {/*        );*/}
            {/*    }*/}
            {/*})}*/}
        </>
    );
}

// import { Paper } from '@mui/material';
// import { useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import type { IUserEvents } from '../pages/landing-page/user-landing-page/user-events.tsx';
// import axios from '../config/client.ts';
// import { Spinner } from './spinner.tsx';
//
// export function EventDetails() {
//     const { eventId } = useParams<string>();
//     const url: string = `/event-details/${eventId}`;
//     const { data, isPending, error } = useQuery({
//         queryKey: [url],
//         queryFn: () => {
//             return axios.get<IUserEvents>(url);
//         },
//     });
//
//     const eventDetails = data?.data;
//     console.log(eventDetails);
//
//     function formatDate(date: string) {
//         return new Date(date).toLocaleString('en-GB');
//     }
//
//     if (isPending) {
//         return <Spinner />;
//     }
//
//     if (!eventDetails) {
//         return <>Not found</>;
//     }
//
//     if (error) {
//         return <>Forbidden</>;
//     }
//
//     return (
//         <Paper sx={{ alignSelf: 'baseline' }}>
//             {eventDetails.imgUrl && <img alt="Event image" src={`${eventDetails.imgUrl}`} />}
//             <Paper>start: {formatDate(eventDetails.start).replace(',', ' at')}</Paper>
//             <Paper>{eventDetails.end}</Paper>
//             <Paper>{eventDetails.description}</Paper>
//             <Paper>{eventDetails.name}</Paper>
//         </Paper>
//     );
// }
