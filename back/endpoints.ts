import express from 'express';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import cors from 'cors';
import {
    attendEvent,
    cancelAttendance,
    createEvent,
    getEvent,
    getEvents,
    updateEventDetails,
    updateEventImage,
} from './controllers/events.controller.js';
import { applicationResponse, deleteAccount, fetchApplications, roleRequest } from './controllers/users.controller.js';
import { authenticateSession, userStaffPermissions } from './middleware/user.js';

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
app.get('/events', getEvents);
app.get('/users/:userId/events', getEvents);
app.get('/events/:eventId', getEvent);
app.put('/events/:eventId', userStaffPermissions, updateEventDetails);
app.put(
    '/events/:eventId/image',
    express.raw({ type: 'application/octet-stream', limit: '2mb' }),
    userStaffPermissions,
    updateEventImage,
);
app.delete('/events/:eventId/attendance', authenticateSession, cancelAttendance);
app.post('/events/:eventId/attendance', authenticateSession, attendEvent);
app.put('/application-response', applicationResponse);
app.post('/events', userStaffPermissions, createEvent);
app.post('/apply-staff', roleRequest);
app.delete('/delete-account', deleteAccount);

app.listen(process.env.APP_PORT, () => {
    console.log(`Now listening port ${process.env.APP_PORT}`);
});
