// src/lib/clearAllStorage.ts
export const clearAllStorage = () => {
  try {
    localStorage.clear();
  } catch {
    // ignore kalau storage nggak accessible (private mode, dll)
  }

  try {
    sessionStorage.clear();
  } catch {
    // ignore
  }
};
