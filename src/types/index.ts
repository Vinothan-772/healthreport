// ============================================================
// SHARED APPLICATION TYPES — Phase 1
// ============================================================

// Navigation item
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

// Auth form fields
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API response wrapper
export interface ActionResult<T = void> {
  data?: T;
  error?: string;
}

// Profile update form
export interface ProfileUpdateData {
  full_name: string;
}
