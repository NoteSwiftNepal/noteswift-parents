/**
 * Global application configuration.
 * Toggle NEXT_PUBLIC_USE_MOCK_DATA environment variable or change the default boolean here:
 * - true: Use local preseeded mock data and mock databases (demo mode)
 * - false: Fetch from real backend APIs
 */
export const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === undefined
    ? true
    : process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
