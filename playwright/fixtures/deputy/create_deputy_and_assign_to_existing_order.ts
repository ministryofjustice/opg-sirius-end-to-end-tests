import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import {
  buildMinimalDeputyPayload,
  type DeputyPayload,
} from "./create_deputy_payload";

interface CreatedDeputy {
  id: number;
  firstname: string;
  surname: string;
}

export const assignDeputyToOrder = async (
  page: Page,
  orderId: number,
  deputyId: number,
): Promise<void> => {
  await postToSiriusApi<unknown>(page, `/api/v1/orders/${orderId}/deputies`, {
    id: deputyId,
  });
};

export const createDeputy = async (
  page: Page,
  overrides: Partial<DeputyPayload> = {},
): Promise<CreatedDeputy> => {
  return postToSiriusApi<CreatedDeputy>(page, "/api/v1/deputies", {
    ...buildMinimalDeputyPayload(),
    ...overrides,
  });
};

export const createDeputyAndAssignToExistingOrder = async (
  page: Page,
  orderId: number,
  overrides: Partial<DeputyPayload> = {},
): Promise<CreatedDeputy> => {
  const deputy = await createDeputy(page, overrides);

  await assignDeputyToOrder(page, orderId, deputy.id);

  return deputy;
};
