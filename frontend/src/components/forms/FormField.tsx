'use client';

import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { TextField as MuiTextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

interface FormFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  control: Control<T>;
  label: string;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  disabled,
  ...props
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          {...props}
          label={label}
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={error?.message || ''}
          fullWidth
          variant="outlined"
        />
      )}
    />
  );
}
