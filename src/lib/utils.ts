// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Format a date string into a human-readable form.
 * Example: "October 6, 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date string into a shorter relative or absolute form.
 * Example: "Oct 6, 2026"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get a greeting based on current time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

/**
 * Extract a user's first name from a full name string.
 */
export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName) return "there";
  return fullName.split(" ")[0] || "there";
}

/**
 * Validate email address format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Map report status to display labels and colors.
 */
export function getStatusDisplay(status: string): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case "completed":
      return { label: "Completed", badgeClass: "badge-success" };
    case "processing":
      return { label: "Processing", badgeClass: "badge-warning" };
    case "failed":
      return { label: "Failed", badgeClass: "badge-danger" };
    case "uploaded":
    default:
      return { label: "Uploaded", badgeClass: "badge-neutral" };
  }
}
