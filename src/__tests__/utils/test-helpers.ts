export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

export const mockLocalStorage = () => {
  const storage: { [key: string]: string } = {};

  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    },
  };
};
