import { useState, useEffect } from "react";
import sha256 from "js-sha256";

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

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const toSha256 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsOriginalMy(file);
    reader.onload = (e) => resolve(sha256(e.target.result));
    reader.onerror = (error) => reject(error);
  });
