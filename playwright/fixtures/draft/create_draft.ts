import { buildDraftPayload } from "./create_draft_payload";
import { postToSiriusApi } from "../../utils/sirius_api";
import type { Page } from "@playwright/test";

export interface CreatedDraft {
  id: number;
}

export const createDraftForClient = async (
  page: Page,
  orderId: number,
  clientId: number,
): Promise<CreatedDraft[]> => {
  return postToSiriusApi<CreatedDraft[]>(
    page,
    `supervision-api/v1/correspondence/orders/${orderId}/drafts`,
    {
      ...buildDraftPayload(),
      correspondents: [
        {
          id: clientId,
          personType: "Client",
        },
      ],
    },
  );
};
