import { useState, useEffect } from "react";
import { initReactI18next } from "react-i18next";

export const useStateWithLocalStorage = (localStorageKey) => {
  const dataStorageItem = localStorage.getItem(localStorageKey);
  const [value, setValue] = useState(
    dataStorageItem ? JSON.parse(dataStorageItem) : null
  );
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);
  return [value, setValue];
};
