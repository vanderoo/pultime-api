export class ApiError extends Error {
    public code: number;
    public status: string;
    public errors: Record<string, any>;
  
    constructor(statusCode: number, status: string, errors: Record<string, any> = {}) {
      super(status);
      this.code = statusCode;
      this.status = status;
      this.errors = errors;
    }
  }