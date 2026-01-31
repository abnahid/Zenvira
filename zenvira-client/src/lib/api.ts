export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://zenvira-server.vercel.app";

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
