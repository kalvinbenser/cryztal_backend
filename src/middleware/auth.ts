import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: jwt.Secret = 'your-secret-key-here';

export type CustomRequest = {
    token: string | jwt.JwtPayload;
} & Request;

/**
 *
 * @param {Request} req --Request from express
 * @param {Response} res -- Response send back to the express server
 * @param {NextFunction} next -- Skips to the next function
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, 'ABCD');
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};
