import { EventListParams } from '../../types';

export function parseEventFilters(searchParams: URLSearchParams): EventListParams {
  const filters: EventListParams = {};

  // Search
  const search = searchParams.get('search');
  if (search) filters.search = search;

  // Category filter
  const categoryId = searchParams.get('categoryId');
  if (categoryId) filters.categoryId = categoryId;

  // Date range filters
  const startDate = searchParams.get('startDate');
  if (startDate) filters.startDate = startDate;

  const endDate = searchParams.get('endDate');
  if (endDate) filters.endDate = endDate;

  // Sorting
  const sortBy = searchParams.get('sortBy');
  if (sortBy && ['date', 'title', 'createdAt'].includes(sortBy)) {
    filters.sortBy = sortBy as 'date' | 'title' | 'createdAt';
  }

  const sortOrder = searchParams.get('sortOrder');
  if (sortOrder && ['asc', 'desc'].includes(sortOrder)) {
    filters.sortOrder = sortOrder as 'asc' | 'desc';
  }

  // Pagination
  const pageNumber = searchParams.get('pageNumber');
  if (pageNumber) {
    const parsed = parseInt(pageNumber, 10);
    if (!isNaN(parsed) && parsed > 0) {
      filters.pageNumber = parsed;
    }
  }

  const pageSize = searchParams.get('pageSize');
  if (pageSize) {
    const parsed = parseInt(pageSize, 10);
    if (!isNaN(parsed) && parsed > 0) {
      filters.pageSize = parsed;
    }
  }

  return filters;
}

export function buildEventFiltersQuery(filters: EventListParams): string {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  if (filters.pageNumber) params.set('pageNumber', filters.pageNumber.toString());
  if (filters.pageSize) params.set('pageSize', filters.pageSize.toString());

  return params.toString();
}

export function updateQueryParams(
  pathname: string,
  filters: EventListParams,
): string {
  const query = buildEventFiltersQuery(filters);
  return query ? `${pathname}?${query}` : pathname;
}

