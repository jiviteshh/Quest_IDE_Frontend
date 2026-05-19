import { useState, useEffect } from "react";

const API_KEY_STORAGE_KEY = "questide_nvidia_api_key";

/**
 * Custom hook to manage NVIDIA API key in localStorage
 * Handles storing, retrieving, and updating user's API key securely
 */
export function useAPIKey() {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKeyState(savedKey);
    }
    setIsLoaded(true);
  }, []);

  /**
   * Save API key to localStorage
   */
  const saveAPIKey = (key: string) => {
    const trimmedKey = key.trim();
    if (trimmedKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
      setApiKeyState(trimmedKey);
    }
  };

  /**
   * Clear API key from localStorage
   */
  const clearAPIKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState("");
  };

  /**
   * Get masked key for display (e.g., nvapi-****1234)
   */
  const getMaskedKey = (): string => {
    if (!apiKey) return "";
    if (apiKey.length <= 8) return "nvapi-****";
    const lastChars = apiKey.slice(-4);
    return `nvapi-${"*".repeat(Math.max(4, apiKey.length - 12))}${lastChars}`;
  };

  /**
   * Check if a valid API key exists
   */
  const hasAPIKey = (): boolean => {
    return apiKey.length > 0;
  };

  /**
   * Get current API key (only used internally for requests)
   */
  const getAPIKey = (): string => {
    return apiKey;
  };

  return {
    apiKey,
    isLoaded,
    hasAPIKey: hasAPIKey(),
    getMaskedKey,
    saveAPIKey,
    clearAPIKey,
    getAPIKey,
  };
}
