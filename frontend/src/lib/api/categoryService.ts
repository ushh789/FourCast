import { apiClient } from './client';
import type { Category, GlobalResponse, PageResponse } from '../../types';

export interface CreateCategoryDto {
  name: string;
  description?: string;
}
export interface CategoryListParams {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const categoryService = {
  getCategories: async (params?: CategoryListParams): Promise<PageResponse<Category>> => {
    const response = await apiClient.get<GlobalResponse<PageResponse<Category>>>(
      '/category',
      { params },
    );

    if (!response.data.data) {
      throw new Error('No categories data in response');
    }

    return response.data.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<GlobalResponse<Category>>(
      `/category/${id}`,
    );

    if (!response.data.data) {
      throw new Error('No category data in response');
    }

    return response.data.data;
  },

  createCategory: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await apiClient.post<GlobalResponse<Category>>(
      '/category',
      data,
    );

    if (!response.data.data) {
      throw new Error('No category data in create response');
    }

    return response.data.data;
  },
};

