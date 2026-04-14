import express from 'express';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import {
    createEvent,
    fetchEvents,
    attendOrCancelEvent,
    getEvent,
    updateEventDetails,
    updateEventImage,
    // fetchUserEvents,
} from './controllers/events.controller';
import { applicationResponse, fetchApplications, roleRequest, deleteAccount } from './controllers/users.controller';

const app = express();

app.use(cors({ origin: [process.env.FRONT_END_URL!], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`);
    next();
});

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Root route working'));

app.get('/applications', fetchApplications);
// /role-requests with query params
app.get('/events', fetchEvents);
app.get('/users/:userId/events', fetchEvents);
app.get('/events/:event_id', getEvent);
app.put('/events/:event_id', updateEventDetails);
app.put('/events/:event_id/image', express.raw({ type: 'application/octet-stream', limit: '2mb' }), updateEventImage);
app.put('/attend-or-cancel', attendOrCancelEvent);
app.put('/application-response', applicationResponse);
app.post('/events', createEvent);
app.post('/apply-staff', roleRequest);
// /role-requests
app.delete('/delete-account', deleteAccount);

app.listen(process.env.APP_PORT, () => {
    console.log(`Now listening port ${process.env.APP_PORT}`);
});
