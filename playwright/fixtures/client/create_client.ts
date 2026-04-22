import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import { buildMinimalClientPayload } from "./create_client_payload";

export interface CreatedClient {
  id: number;
  caseRecNumber: string;
  firstname: string;
  surname: string;
}

export const createClient = async (page: Page): Promise<CreatedClient> => {
  const payload = buildMinimalClientPayload();

  return await postToSiriusApi<CreatedClient>(page, "/api/v1/clients", payload);
};
