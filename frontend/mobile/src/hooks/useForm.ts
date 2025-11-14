import { useState } from "react";

type ValidationFunction<T> = (value: T[keyof T], values: T) => string | null;

interface UseFormOptions<T> {
  initialValues: T;
  validations?: Partial<Record<keyof T, ValidationFunction<T>>>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validations = {},
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
 
  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
 
    if (validations[name]) {
      const error = validations[name]?.(value, { ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };
 
  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const key in validations) {
      const value = values[key];
      const error = validations[key]?.(value, values);
      if (error) {
        valid = false;
        newErrors[key] = error;
      }
    }

    setErrors(newErrors);
    return valid;
  };
 
  const isFormValid = (): boolean => {
    return Object.values(errors).every((error) => !error);
  };
 
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    validateForm,
    isFormValid,
    resetForm,
  };
}
