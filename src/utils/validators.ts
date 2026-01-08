export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  return isNotEmpty(value) ? null : `${fieldName} is required`;
};

export const validateEmail = (email: string): string | null => {
  if (!isNotEmpty(email)) return "Email is required";
  if (!isValidEmail(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!isNotEmpty(password)) return "Password is required";
  if (!isValidPassword(password)) {
    return "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number";
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!isNotEmpty(confirmPassword)) return "Confirm password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};
