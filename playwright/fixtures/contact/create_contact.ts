import type { Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import { buildMinimalContactPayload } from "./create_contact_payload";

export interface CreatedContact {
  id: number;
}

export const createContactForClient = async (
  page: Page,
  clientId: number,
): Promise<CreatedContact> => {
  const payload = buildMinimalContactPayload();

  return await postToSiriusApi<CreatedContact>(
    page,
    `/supervision-api/v1/clients/${clientId}/contacts`,
    payload,
  );
};
