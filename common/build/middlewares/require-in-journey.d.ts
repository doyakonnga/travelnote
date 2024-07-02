import { Request, Response, NextFunction } from "express";
import "./req-user";
export declare function requireInJourney(req: Request, res: Response, next: NextFunction): Promise<void>;
