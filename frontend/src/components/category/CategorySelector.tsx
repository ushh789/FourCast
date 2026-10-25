'use client';

import { useState, useEffect, useMemo } from 'react';
import { Autocomplete, TextField, Button, Box, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useCategories } from '../../hooks/api';
import { Category } from '../../types';
import { debounce } from '@mui/material/utils';
import { CreateCategoryDialog } from './CreateCategoryDialog';

interface CategorySelectorProps {
  value?: string;
  onChange: (categoryId: string) => void;
  error?: string;
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  const { data: categoriesData, isLoading } = useCategories({
    search: debouncedSearch || undefined,
    pageSize: 50,
  });

  const categories = categoriesData?.content || [];
  const selectedCategory = categories.find((cat) => cat.id === value) || null;

  const handleCategoryCreated = (newCategory: Category) => {
    onChange(newCategory.id);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Autocomplete
            value={selectedCategory}
            onChange={(_, newValue: Category | null) => {
              onChange(newValue?.id || '');
            }}
            inputValue={searchTerm}
            onInputChange={(_, newInputValue) => {
              setSearchTerm(newInputValue);
            }}
            options={categories}
            getOptionLabel={(option) => option.name}
            loading={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                error={!!error}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText="No categories found"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
          sx={{ minWidth: '140px', height: '56px' }}
        >
          New
        </Button>
      </Box>

      <CreateCategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </>
  );
}
