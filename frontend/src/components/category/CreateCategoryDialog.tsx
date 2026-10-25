'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useCreateCategory } from '../../hooks/api';
import { Category } from '../../types';

interface CreateCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onCategoryCreated?: (category: Category) => void;
}

export function CreateCategoryDialog({
  open,
  onClose,
  onCategoryCreated,
}: CreateCategoryDialogProps) {
  const createCategory = useCreateCategory();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const newCategory = await createCategory.mutateAsync({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      });

      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
      }

      handleClose();
    } catch {
      setError('Failed to create category. Please try again.');
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setCategoryDescription('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Category</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Description (optional)"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={createCategory.isPending}
          startIcon={createCategory.isPending && <CircularProgress size={16} />}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

