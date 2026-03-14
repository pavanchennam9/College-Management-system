import { useState, useEffect } from 'react';

// Hook that keeps a value in sync with localStorage.
// `key` is the storage key, `defaultValue` is used if nothing is stored yet.
// The stored value is JSON serialized, so it works with objects and arrays.
// Usage:
// const [data, setData] = usePersistentState('my-data', {});
// setData(newVal) will update both state and localStorage automatically.
export default function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored);
    } catch (err) {
      // ignore parse errors
    }
    // if default is a function, evaluate it lazily (like useState)
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Failed to persist', key, err);
    }
  }, [key, value]);

  return [value, setValue];
}
