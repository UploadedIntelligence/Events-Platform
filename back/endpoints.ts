import express from 'express';
import cookieParser from 'cookie-parser';
import { getUser } from './controllers/users.controller';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';
import { createEvent, fetchFutureEvents, fetchPastEvents } from './controllers/events.controller';

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
app.get('/user', getUser);

app.post('/create-event', createEvent);
app.get('/upcoming-events', fetchFutureEvents);
app.get('/past-events', fetchPastEvents);

app.listen(process.env.APP_PORT, () => {
    console.log(`Now listening port ${process.env.APP_PORT}`);
});
