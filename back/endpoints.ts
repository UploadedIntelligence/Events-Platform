import express from 'express';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import { createEvent, fetchEvents, attendOrCancelEvent } from './controllers/events.controller';
import { applicationsResponse, fetchApplications, staffApplication } from './controllers/users.controller';

const app = express();

app.use(cors({ origin: ['http://localhost:5173'], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

app.get('/', (req, res) => res.status(200).send('Root route working'));

app.post('/create-event', createEvent);
app.put('/attend-or-cancel', attendOrCancelEvent);
app.get(['/upcoming-events', '/past-events', '/attending'], fetchEvents);
app.get('/apply-staff', staffApplication);
app.get('/applications', fetchApplications);
app.put('/application-response', applicationsResponse)

app.listen(process.env.APP_PORT, () => {
    console.log(`Now listening port ${process.env.APP_PORT}`);
});
