import { Response } from 'express';
import { ApiError } from './api-error';
import {ErrorResponse, Paging, SuccessResponse} from "../models/response";

export const sendSuccessResponse = <T>(
    res: Response,
    code: number,
    status: string,
    data: T,
    paging?: Paging
): void => {
    const response: SuccessResponse<T> = {
        code,
        status,
        data,
        paging,
    };
    res.status(code).json(response);
};

export const sendErrorResponse = (
    res: Response,
    err: ApiError
): void => {

    const { code, status, errors } = err;

    const response: ErrorResponse = {
        code,
        status,
        errors,
    };
    res.status(code).json(response);
};
