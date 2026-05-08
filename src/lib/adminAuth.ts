const ADMIN_AUTH_KEY = "beijing-faith-explorer:admin-auth";
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "faithmap2026";

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "ok";
};

export const loginAdmin = (username: string, password: string): boolean => {
  const valid = username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
  if (valid && typeof window !== "undefined") {
    window.sessionStorage.setItem(ADMIN_AUTH_KEY, "ok");
  }
  return valid;
};

export const logoutAdmin = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
};

