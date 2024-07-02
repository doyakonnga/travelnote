import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface UserToken {
            id: string;
            email: string;
            name?: string;
            avatar?: string;
            journeyIds: string[];
        }
        interface Request {
            user: UserToken;
        }
    }
}
export declare const reqUser: (req: Request, res: Response, next: NextFunction) => void;
