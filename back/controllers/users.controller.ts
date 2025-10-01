import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from "jwt-decode";

interface IUser extends JwtPayload {
    id: number;
    name: string;
    email: string;
    staff: boolean;
}

async function registerUser(req: Request, res: Response) {
    const { name, email, password, staff } = req.body

    // need validation for staff registration by other staff members
    // need a default account/email that is designated for handling initial registrations
}

async function getUser(req: Request, res: Response) {
    if (req.cookies.user === undefined) {
        res.status(200).json(null)
    } else {
        const user_token = req.cookies.user;
        try {
            const user = jwt.verify(user_token, process.env.JWT_SECRET!) as IUser;
            res.status(200).json(user)
        } catch(e) {

        }
    }
}

async function logUser(req: Request, res: Response) {

}

export { getUser, registerUser, logUser }