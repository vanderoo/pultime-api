export interface IPage {
    size: number;
    total: number;
    totalPages: number;
    current: number;
}

export interface ISuccessResponse<T> {
    code: number;
    status: string;
    data: T;
    page?: IPage;
}

export interface IErrorResponse {
    code: number;
    status: string;
    errors: Array<Record<string, any>>;
}
