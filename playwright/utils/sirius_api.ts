import { type BrowserContext, type Page } from "@playwright/test";
import * as config from "../playwright.config";

const buildApiHeaders = async (
  page: Page,
  context: BrowserContext,
): Promise<Record<string, string>> => {
  const currentUserResponse = await page.request.get("/api/v1/users/current", {
    headers: {
      accept: "application/json",
      "opg-bypass-membrane": "1",
    },
  });

  const authorizationToken = currentUserResponse.headers()["authorization"];
  if (!authorizationToken) {
    throw new Error("Missing authorization header from /api/v1/users/current");
  }

  const cookies = await context.cookies(config.default.use.baseURL);
  const csrfCookie = cookies.find(({ name }) => name === "XSRF-TOKEN");
  if (!csrfCookie) {
    throw new Error("Missing XSRF-TOKEN cookie for API request");
  }

  return {
    accept: "application/json",
    authorization: authorizationToken,
    "content-type": "application/json",
    "opg-bypass-membrane": "1",
    "x-xsrf-token": decodeURIComponent(csrfCookie.value),
  };
};

export const postToSiriusApi = async <TResponse>(
  page: Page,
  context: BrowserContext,
  path: string,
  data: unknown,
): Promise<TResponse> => {
  const headers = await buildApiHeaders(page, context);

  const response = await page.request.post(path, {
    headers,
    data,
  });

  if (!response.ok()) {
    throw new Error(
      `POST ${path} failed with ${response.status()} ${response.statusText()}`,
    );
  }

  return (await response.json()) as TResponse;
};

