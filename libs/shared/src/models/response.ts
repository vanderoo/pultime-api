export type Paging = {
    size: number;
    total_pages: number;
    current_page: number;
}

export type SuccessResponse<T> = {
    code: number;
    status: string;
    data: T;
    paging?: Paging;
}

export type ErrorResponse = {
    code: number;
    status: string;
    errors: Array<Record<string, any>>;
}

export type Pageable<T> = {
    data: Array<T>
    paging: Paging
}