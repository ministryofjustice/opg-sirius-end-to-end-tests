import { expect, type Page } from "@playwright/test";
import { postToSiriusApi } from "./sirius_api";

interface SearchResponse {
  total: {
    count: number;
  };
}

export const waitForSearchService = async (
  page: Page,
  searchTerm = "",
  personTypes: string[] = [],
  minimumExpected = 1,
): Promise<void> => {
  await expect
    .poll(
      async () => {
        const response = await postToSiriusApi<SearchResponse>(
          page,
          "/api/v1/search/searchAll",
          {
            personTypes,
            term: searchTerm,
          },
        );

        return response.total.count;
      },
      {
        timeout: 10_000,
        intervals: [500],
      },
    )
    .toBeGreaterThanOrEqual(minimumExpected);
};
