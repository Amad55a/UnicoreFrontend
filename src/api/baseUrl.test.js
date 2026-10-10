import { describe, expect, it } from "vitest";
import { buildGoogleAuthUrl, resolveApiBaseUrl } from "./baseUrl.js";

describe("local and production API URLs", () => {
  it("uses the local Vite proxy when no local API URL is configured", () => {
    expect(resolveApiBaseUrl("", "localhost")).toBe("/api/v1");
    expect(buildGoogleAuthUrl("", "localhost")).toBe("/api/v1/auth/google");
  });

  it("uses the approved production API when the browser is not local", () => {
    expect(resolveApiBaseUrl("", "unicores.tech"))
      .toBe("https://api.unicores.tech/api/v1");
  });
});
