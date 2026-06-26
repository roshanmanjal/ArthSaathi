/**
 * ArthSaathi - Store Persistence Helpers
 */

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`as_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`as_${key}`, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}
