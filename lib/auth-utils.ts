/**
 * Get user role from localStorage
 */
export function getUserRole(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole');
  }
  return null;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  return getUserRole() === 'admin';
}

/**
 * Check if user is buyer
 */
export function isBuyer(): boolean {
  return getUserRole() === 'buyer';
}

/**
 * Clear user role from localStorage
 */
export function clearUserRole(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole');
  }
}
