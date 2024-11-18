import { Response } from 'express';
import { ISuccessResponse, IErrorResponse, IPage } from '../interfaces/response';
import { ApiError } from './api-error';

export const sendSuccessResponse = <T>(
    res: Response,
    code: number,
    status: string,
    data: T,
    page?: IPage
): void => {
    const response: ISuccessResponse<T> = {
        code,
        status,
        data,
        page,
    };
    res.status(code).json(response);
};

export const sendErrorResponse = (
    res: Response,
    err: ApiError
): void => {

    const { code, status, errors } = err;

    const response: IErrorResponse = {
        code,
        status,
        errors,
    };
    res.status(code).json(response);
};
