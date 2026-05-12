import { type Page } from "@playwright/test";
import { putToSiriusApi } from "../../utils/sirius_api";
import { type VisitPayload } from "./create_visit_payload";

export const editVisitForClient = async (
  page: Page,
  clientId: number,
  visitId: number,
  updates: Partial<VisitPayload>,
): Promise<void> => {
  await putToSiriusApi<null>(
    page,
    `/supervision-api/v1/clients/${clientId}/visits/${visitId}`,
    updates,
  );
};
