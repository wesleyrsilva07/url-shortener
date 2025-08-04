type ErrorResponse = {
  code: string;
  message: string;
};

export class ApiResponseClass<T> {
  data: T | null;
  error: ErrorResponse | null;

  constructor(data: T | null = null, error: ErrorResponse | null = null) {
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T): ApiResponseClass<T> {
    return new ApiResponseClass(data, null);
  }

  static error(code: string, message: string): ApiResponseClass<null> {
    return new ApiResponseClass(null, { code, message });
  }
}
