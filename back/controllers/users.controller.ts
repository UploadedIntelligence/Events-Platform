import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';

interface IUser extends JwtPayload {
    id: number;
    name: string;
    email: string;
    staff: boolean;
}

async function getUser(req: Request, res: Response) {
    if (req.cookies.user === undefined) {
        res.status(200).json(null);
    } else {
        const user_token = req.cookies.user;
        try {
            const user = jwt.verify(user_token, process.env.JWT_SECRET!) as IUser;
            res.status(200).json(user);
        } catch (e) {}
    }
}

export { getUser };
