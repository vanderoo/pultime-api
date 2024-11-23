import { Request, Response, NextFunction } from 'express';
import { signupValidator, loginValidator, logoutValidator, refreshTokenValidator } from '../validators/auth';
import {ApiError} from "../utils/api-error";
import {sendErrorResponse} from "../utils/response";

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
    const result = signupValidator.safeParse(req.body);
    if (!result.success) {
        const error = new ApiError(400,'INVALID_REQUEST_DATA', result.error.errors);
        sendErrorResponse(res, error);
        return;
    }
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const result = loginValidator.safeParse(req.body);
    if (!result.success) {
        const error = new ApiError(400,'INVALID_REQUEST_DATA', result.error.errors);
        sendErrorResponse(res, error);
        return;
    }
    next();
};

export const validateLogout = (req: Request, res: Response, next: NextFunction) => {
    const result = logoutValidator.safeParse(req.body);
    if (!result.success) {
        const error = new ApiError(400,'INVALID_REQUEST_DATA', result.error.errors);
        sendErrorResponse(res, error);
        return;
    }
    next();
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const result = refreshTokenValidator.safeParse(req.body);
    if (!result.success) {
        const error = new ApiError(400,'INVALID_REQUEST_DATA', result.error.errors);
        sendErrorResponse(res, error);
        return;
    }
    next();
};
