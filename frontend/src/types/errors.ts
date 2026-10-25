export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  name: string;
  data: null;
}

export interface AppError {
  statusCode: number;
  message: string;
  name: string;
  timestamp?: string;
  path?: string;
}




