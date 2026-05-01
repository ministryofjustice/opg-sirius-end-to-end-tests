import { type Page } from "@playwright/test";

const sendToSiriusApi = async <TResponse>(
  page: Page,
  method: "POST" | "PUT",
  url: string,
  data: unknown,
): Promise<TResponse> => {
  const csrfCookie = (await page.context().cookies()).find(
    (cookie) => cookie.name === "XSRF-TOKEN",
  );
  if (csrfCookie == null) {
    throw new Error("Missing XSRF-TOKEN cookie");
  }

  const csrfToken = decodeURIComponent(csrfCookie.value);

  const response = await page.request.fetch(url, {
    method,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-xsrf-token": csrfToken,
    },
    data,
  });

  if (response.ok()) {
    if (response.status() === 200 || response.status() === 201) {
      return response.json();
    }

    return null;
  }

  throw new Error(
    `Request failed (${method} ${url}) with status ${response.status()}`,
  );
};

export const postToSiriusApi = async <TResponse>(
  page: Page,
  url: string,
  data: unknown,
): Promise<TResponse> => {
  return sendToSiriusApi<TResponse>(page, "POST", url, data);
};

export const putToSiriusApi = async <TResponse>(
  page: Page,
  url: string,
  data: unknown,
): Promise<TResponse> => {
  return sendToSiriusApi<TResponse>(page, "PUT", url, data);
};
