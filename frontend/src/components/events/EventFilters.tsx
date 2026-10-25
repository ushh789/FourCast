/**
 * Event Filters Component
 * Provides filtering and sorting controls for events list
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { EventFilters as EventFiltersType } from '../../types';
import { useCategories } from '../../hooks/api';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
  onClearFilters: () => void;
}

export function EventFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: EventFiltersProps) {
  const { data: categories } = useCategories();
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ ...filters, search: searchValue || undefined });
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleChange = (key: keyof EventFiltersType, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const hasActiveFilters =
    filters.search ||
    filters.categoryId ||
    filters.startDate ||
    filters.endDate ||
    filters.sortBy ||
    filters.sortOrder;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ flexWrap: 'wrap' }}
      >
        {/* Search */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 300px', md: '2 1 400px' } }}>
          <TextField
            fullWidth
            placeholder="Search events..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Category Filter */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 200px' } }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.categoryId || ''}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories?.content.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Sort By */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 150px' } }}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy || 'date'}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              label="Sort By"
            >
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="createdAt">Created At</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Sort Order */}
        <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 150px' } }}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder || 'asc'}
              onChange={(e) => handleChange('sortOrder', e.target.value)}
              label="Order"
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {hasActiveFilters && (
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={onClearFilters}
              sx={{ height: '56px', minWidth: '120px' }}
            >
              Clear
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

