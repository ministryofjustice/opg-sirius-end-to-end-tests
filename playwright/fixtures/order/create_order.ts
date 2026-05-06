import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import {
  buildMinimalOrderPayload,
  type OrderPayload,
} from "./create_order_payload";

export interface CreatedOrder {
  id: number;
  caseRecNumber: string;
}

export const createOrderForClient = async (
  page: Page,
  clientId: number,
  overrides: Partial<OrderPayload> = {},
): Promise<CreatedOrder> => {
  const payload = {
    ...buildMinimalOrderPayload(),
    ...overrides,
  };

  return postToSiriusApi<CreatedOrder>(
    page,
    `/supervision-api/v1/clients/${clientId}/orders`,
    payload,
  );
};
