import React from 'react';
import { useForm, SubmitHandler, FormProvider, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  Button,
  Typography
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';

export type FormField = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'textarea';
  defaultValue?: any;
  validation?: z.ZodTypeAny;
  textFieldProps?: MuiTextFieldProps;
  fullWidth?: boolean;
  className?: string;
};

type GenericFormProps<T extends FieldValues> = {
  fields: FormField[];
  schema: z.ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  formTitle?: string;
  submitButtonText?: string;
  formMethods?: UseFormReturn<T>;
  children?: React.ReactNode;
  formOptions?: Omit<UseFormProps<T>, 'resolver'>;
  containerClassName?: string;
  fieldsContainerClassName?: string;
};

const FormFieldInput = <T extends FieldValues>({
  field,
  control
}: {
  field: FormField;
  control: UseFormReturn<T>['control'];
}) => {
  return (
    <Controller
      name={field.name as any}
      control={control}
      defaultValue={field.defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className={field.className || 'col-span-12'}>
          <MuiTextField
            fullWidth={field.fullWidth !== false}
            value={value ?? ''}
            onChange={onChange}
            error={!!error}
            helperText={error?.message}
            type={field.type || 'text'}
            variant="outlined"
            margin="normal"
            size="medium"
            multiline={field.type === 'textarea'}
            rows={field.type === 'textarea' ? 4 : undefined}
            {...field.textFieldProps}
            InputProps={{
              ...field.textFieldProps?.InputProps,
              sx: {
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                ...field.textFieldProps?.InputProps?.sx
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: field.type === 'textarea' ? undefined : '48px',
              },
              ...field.textFieldProps?.sx
            }}
          />
        </div>
      )}
    />
  );
};

export const GenericForm = <T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  formTitle,
  submitButtonText = 'Submit',
  formMethods,
  children,
  formOptions,
  containerClassName = 'max-w-4xl mx-auto p-6',
  fieldsContainerClassName = 'grid grid-cols-12 gap-4 p-4',
}: GenericFormProps<T>) => {
  const defaultValues = fields.reduce((acc, field) => {
    if (field.defaultValue !== undefined) {
      return { ...acc, [field.name]: field.defaultValue };
    }
    return acc;
  }, {} as Partial<T>);

  const methods = formMethods || useForm<T>({
    ...formOptions,
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <div className={containerClassName}>
        {formTitle && (
          <Typography variant="h5" component="h2" className="mb-6 text-center">
            {formTitle}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={fieldsContainerClassName}>
            {fields.map((field) => (
              <FormFieldInput<T> key={field.name} field={field} control={control} />
            ))}
          </div>

          {children}

          <div className="mt-6 flex justify-end gap-4 px-4">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};