// Zustand store for authentication forms
import { create } from "zustand";

// Types for form states
export type AuthFormType =
  | "login"
  | "signup"
  | "forgotPassword"
  | "resetPassword";

export interface FormValues {
  [key: string]: string;
}

export interface AuthFormState {
  // Current form type (login, signup, etc.)
  formType: AuthFormType;
  // Form field values
  values: FormValues;
  // Validation errors for fields
  error: string;
  // Loading state for async actions
  isLoading: boolean;
  // Submission success state
  success: boolean;
  // Set the current form type
  setFormType: (type: AuthFormType) => void;
  // Update a field value
  setFieldValue: (field: string, value: string) => void;
  // Set validation errors
  setError: (errors: string) => void;
  //  Clear all validation errors
  clearError: () => void;
  // Set loading state
  setIsLoading: (isLoading: boolean) => void;
  // Set submission success state
  setSuccess: (success: boolean) => void;
  // Reset form state
  resetForm: () => void;
}

// Centralized Zustand store for all auth forms
export const useAuthFormStore = create<AuthFormState>((set) => ({
  formType: "login",
  values: {},
  error: "",
  isLoading: false,
  success: false,
  setFormType: (type) =>
    set(() => ({ formType: type, values: {}, errors: "", success: false })),
  setFieldValue: (field, value) =>
    set((state) => ({ values: { ...state.values, [field]: value } })),
  setError: (error) => set(() => ({ error })),
  clearError: () => set(() => ({ error: "" })),
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  setSuccess: (success) => set(() => ({ success })),
  resetForm: () =>
    set((state) => ({
      values: {},
      error: "",
      loading: false,
      success: false,
    })),
}));

/**
 * Example usage in a form component (e.g., LoginForm.tsx):
 *
 * import { useAuthFormStore } from '../stores/authFormStore';
 *
 * const LoginForm = () => {
 *   const { values, setFieldValue, errors, setErrors, loading, setLoading, success, setSuccess, resetForm } = useAuthFormStore();
 *
 *   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     setFieldValue(e.target.name, e.target.value);
 *   };
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     setLoading(true);
 *     // ...validate and submit logic...
 *     setLoading(false);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" value={values.email || ''} onChange={handleChange} />
 *       <input name="password" value={values.password || ''} onChange={handleChange} />
 *       {/* ...other fields... */
/*}
 *      // <button type="submit" disabled={loading}>Login</button>
 *    /*   {errors.email && <span>{errors.email}</span>}
 *       {success && <span>Login successful!</span>}
 *     </form>
 *   );
 * };
 */

// This store is reusable and scalable for all authentication forms.
// Add new form types and fields as needed for future forms.
// All state updates are immutable and predictable.
// TypeScript ensures strong type safety and maintainability.
