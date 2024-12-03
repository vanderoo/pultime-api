import { Request, Response, NextFunction } from 'express';
import { ApiError } from "../utils/api-error";
import { sendErrorResponse } from "../utils/response";

export const validate = (validator: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = validator.safeParse(req.body);
        if (!result.success) {
            const error = new ApiError(400, 'VALIDATION_ERROR', result.error.errors);
            sendErrorResponse(res, error);
            return;
        }
        next();
    };
};