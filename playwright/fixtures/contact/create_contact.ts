import type { Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import {
  buildMinimalContactPayload,
  ContactPayload,
} from "./create_contact_payload";
import { buildMinimalVisitPayload } from "../visit/create_visit_payload";

export interface CreatedContact {
  id: number;
}

export const createContactForClient = async (
  page: Page,
  clientId: number,
  overrides: Partial<ContactPayload> = {},
): Promise<CreatedContact> => {
  const payload = {
    ...buildMinimalContactPayload(),
    ...overrides,
  };

  return await postToSiriusApi<CreatedContact>(
    page,
    `/supervision-api/v1/clients/${clientId}/contacts`,
    payload,
  );
};
