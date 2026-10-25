export interface GlobalResponse<T = unknown> {
  statusCode: number;
  message: string;
  name: string;
  data: T | null;
}

export interface PageResponse<T> {
  content: T[];
  totalCount: number;
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}
