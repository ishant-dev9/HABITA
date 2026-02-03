
import { AppData } from '../types';

const STORAGE_KEY = 'habita_v1_data';

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return {
      user: null,
      habits: [],
      logs: [],
      moods: [],
      messages: [],
      experiments: []
    };
  }
  return JSON.parse(stored);
};

export const clearData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
