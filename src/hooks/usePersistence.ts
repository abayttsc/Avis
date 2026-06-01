import { useState, useCallback } from 'react';

/**
 * Deep merge two objects.
 */
function deepMerge(target: any, source: any): any {
  if (!source || typeof source !== 'object') return source;
  if (!target || typeof target !== 'object') return source;

  const output = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!(key in target)) {
        output[key] = source[key];
      } else {
        output[key] = deepMerge(target[key], source[key]);
      }
    } else {
      output[key] = source[key];
    }
  });
  return output;
}

/**
 * Robust persistence hook utilizing localStorage with deep-merging to protect schema updates.
 */
export function usePersistence<T>(key: string, initialValue: T) {
  // Get from local storage then parse
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Deep merge initialValue with parsed to ensure new keys in schema are present
        // We merge initialValue (schema) INTO parsed (data) but actually we want to ensure
        // all keys from initialValue exist.
        return deepMerge(initialValue, parsed);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}
