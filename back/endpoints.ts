import express from 'express';
import cookieParser from 'cookie-parser';
import { getUser, registerUser, logUser } from './controllers/users.controller';
import { fromNodeHeaders, toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import cors from 'cors';

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
app.get('/user/register', registerUser);
app.get('/user/login', logUser);

app.listen(process.env.APP_PORT, () => {
    console.log(`Now listening port ${process.env.APP_PORT}`);
});
