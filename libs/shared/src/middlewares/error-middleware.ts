import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error";
import { sendErrorResponse } from "../utils/response";

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        const apiError = new ApiError(400, "VALIDATION_ERROR", error.errors.map(err => ({ message: err.message, path: err.path })));
        sendErrorResponse(res, apiError);
    } else if (error instanceof ApiError) {
        sendErrorResponse(res, error);
    } else {
        const apiError = new ApiError(500, "INTERNAL_SERVER_ERROR", [{ message: error.message }]);
        sendErrorResponse(res, apiError);
    }
};
