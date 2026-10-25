import type { AxiosError } from 'axios';
import type { ApiErrorResponse, AppError } from '../../types';

export function normalizeError(error: unknown): AppError {
  if (!error) {
    return {
      statusCode: 500,
      message: 'An unknown error occurred',
      name: 'UnknownError',
    };
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data) {
    return {
      statusCode: axiosError.response.data.statusCode,
      message: axiosError.response.data.message,
      name: axiosError.response.data.name,
    };
  }

  if (axiosError.message) {
    return {
      statusCode: 0,
      message: axiosError.message,
      name: 'NetworkError',
    };
  }

  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
    name: 'UnexpectedError',
  };
}

export function getErrorMessage(error: unknown): string {
  const normalized = normalizeError(error);
  return getUserFriendlyErrorMessage(normalized);
}

export function getUserFriendlyErrorMessage(error: AppError): string {
  const { statusCode, message } = error;

  switch (statusCode) {
    case 400:
      return 'Invalid input. Please check your data.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists.';
    case 422:
      return message || 'Validation failed. Please check your input.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return message || 'An error occurred. Please try again.';
  }
}

export function isAuthError(error: AppError): boolean {
  return error.statusCode === 401 || error.statusCode === 403;
}

export function isNetworkError(error: AppError): boolean {
  return error.statusCode === 0 || error.name === 'NetworkError';
}

export function isServerError(error: AppError): boolean {
  return error.statusCode >= 500;
}

export function isValidationError(error: AppError): boolean {
  return error.statusCode === 400 || error.statusCode === 422;
}

export function isNotFoundError(error: AppError): boolean {
  return error.statusCode === 404;
}
