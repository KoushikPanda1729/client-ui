// Helper functions

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};
