const DEFAULT_BACKEND_URL = "https://api.unicores.tech";

export const resolveApiBaseUrl = (provided = "", host = "") => {
  const raw = String(provided ?? "").trim();

  if (raw) {
    const cleaned = raw.replace(/\/+$/u, "");

    if (/^https?:\/\//u.test(cleaned)) {
      return cleaned.endsWith("/api/v1") || cleaned.endsWith("/api")
        ? cleaned
        : `${cleaned}/api/v1`;
    }

    if (cleaned.startsWith("/")) {
      return cleaned.includes("/api/v1") || cleaned.includes("/api")
        ? cleaned
        : `${cleaned}/api/v1`;
    }

    return `/${cleaned}`;
  }

  const currentHost = host || (typeof window !== "undefined" ? window.location.hostname : "");
  const isLocalHost = /^(localhost|127\.0\.0\.1)$/iu.test(currentHost);

  return isLocalHost ? "/api/v1" : `${DEFAULT_BACKEND_URL}/api/v1`;
};

export const buildGoogleAuthUrl = (provided = "", host = "") => {
  const baseUrl = resolveApiBaseUrl(provided, host);
  return `${baseUrl}/auth/google`;
};
