export class ApiError extends Error {
    public code: number;
    public status: string;
    public errors: Array<Record<string, any>>;

    constructor(statusCode: number, status: string, errors: Array<Record<string, any>> = []) {
        super(status);

        this.name = 'ApiError';

        this.code = statusCode;
        this.status = status;
        this.errors = errors;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}
