import { TextField } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { toDateTimeLocalString, fromDateTimeLocalString } from '../../lib/utils/dateFormatter';

interface DateTimeFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function DateTimeField<T extends FieldValues>({
  name,
  control,
  label,
  error,
  required = false,
  disabled = false,
}: DateTimeFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          label={label}
          type="datetime-local"
          fullWidth
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={error}
          InputLabelProps={{ shrink: true }}
          value={toDateTimeLocalString(field.value as Date)}
          onChange={(e) => {
            field.onChange(fromDateTimeLocalString(e.target.value));
          }}
        />
      )}
    />
  );
}

