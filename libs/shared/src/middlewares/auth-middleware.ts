import { Response, NextFunction } from "express";
import { UserRequest } from "../types/user-request";
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/api-error";
import { sendErrorResponse } from "../utils/response";

export const authMiddleware = (prismaClient: any, secret: string) => {
    return async (req: UserRequest, res: Response, next: NextFunction) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            const error = new ApiError(401, 'UNAUTHORIZED', [{ message: "Unauthorized. No token provided." }]);
            sendErrorResponse(res, error);
            return;
        }

        try {
            const decoded = jwt.verify(token, secret) as { id: string };
            const user = await prismaClient.user.findUnique({
                where: { id: decoded.id },
            });

            if (user) {
                req.user = user;
                next();
            } else {
                const error = new ApiError(401, 'UNAUTHORIZED', [{ message: "Unauthorized. User not found." }]);
                sendErrorResponse(res, error);
                return;
            }
        } catch (error) {
            console.error('Invalid token:', error);
            const err = new ApiError(401, 'UNAUTHORIZED', [{ message: "Invalid or expired token." }]);
            sendErrorResponse(res, err);
            return;
        }
    };
}
