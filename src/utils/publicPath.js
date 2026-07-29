const baseUrl = import.meta.env.BASE_URL || "/";

export function withPublicBase(path) {
  if (!path) return path;
  const value = String(path);
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) return value;
  return `${baseUrl}${value.replace(/^\/+/, "")}`;
}

export const routerBasename = baseUrl === "/" ? undefined : baseUrl.replace(/\/$/, "");
