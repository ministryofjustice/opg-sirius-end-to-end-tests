import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import {
  buildMinimalDeputyPayload,
  type DeputyPayload,
} from "./create_deputy_payload";

interface CreatedDeputy {
  id: number;
}

export const createDeputyAndAssignToExistingOrder = async (
  page: Page,
  orderId: number,
  overrides: Partial<DeputyPayload> = {},
): Promise<void> => {
  const deputy = await postToSiriusApi<CreatedDeputy>(
    page,
    "/api/v1/deputies",
    {
      ...buildMinimalDeputyPayload(),
      ...overrides,
    },
  );

  await postToSiriusApi<unknown>(page, `/api/v1/orders/${orderId}/deputies`, {
    id: deputy.id,
  });
};
