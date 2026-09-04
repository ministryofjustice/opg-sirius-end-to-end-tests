import type { Page } from "@playwright/test";
import { putToSiriusApi } from "../../utils/sirius_api";
import {
  buildErroredDeputyPayload,
  UpdateDeputyOnOrderPayload,
} from "./update_deputy_on_order_payload";

export const updateDeputyOnOrder = async (
  page: Page,
  deputyId: number,
  orderId: number,
  payload: UpdateDeputyOnOrderPayload,
): Promise<void> => {
  await putToSiriusApi<UpdateDeputyOnOrderPayload>(
    page,
    `/supervision-api/v1/orders/${orderId}/deputies/${deputyId}`,
    payload,
  );
};

export const updateDeputyWithErrorStatus = async (
  page: Page,
  deputyId: number,
  orderId: number,
  overrides: Partial<UpdateDeputyOnOrderPayload> = {},
): Promise<void> => {
  await updateDeputyOnOrder(page, deputyId, orderId, {
    ...buildErroredDeputyPayload(),
    ...overrides,
  });
};
