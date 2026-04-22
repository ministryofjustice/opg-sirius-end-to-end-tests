import { type Page } from "@playwright/test";

export const postToSiriusApi = async <TResponse>(
  page: Page,
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

  const response = await page.request.post(url, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-xsrf-token": csrfToken,
    },
    data: data,
  });

  if (response.ok()) {
    if (response.status() === 200 || response.status() === 201) {
      return response.json();
    } else {
      return null;
    }
  }
};
