export interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  size: number;
  items: T[];
}
