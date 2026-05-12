import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import {
  buildMinimalVisitPayload,
  type VisitPayload,
} from "./create_visit_payload";

export interface CreatedVisit {
  id: number;
}

export const createVisitForClient = async (
  page: Page,
  clientId: number,
  overrides: Partial<VisitPayload> = {},
): Promise<CreatedVisit> => {
  const payload = {
    ...buildMinimalVisitPayload(),
    ...overrides,
  };

  return postToSiriusApi<CreatedVisit>(
    page,
    `/api/v1/clients/${clientId}/visits`,
    payload,
  );
};
