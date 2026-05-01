import { type Page } from "@playwright/test";
import { putToSiriusApi } from "../../utils/sirius_api";

interface MakeOrderActivePayload {
  orderStatus: {
    handle: string;
    label: string;
  };
  statusDate: string;
  statusNotes: string;
}

const buildDefaultOrderStatusPayload = (): MakeOrderActivePayload => ({
  orderStatus: {
    handle: "ACTIVE",
    label: "Active",
  },
  statusDate: "23/03/2023",
  statusNotes: "",
});

export const makeOrderActive = async (
  page: Page,
  orderId: number,
  overrides: Partial<MakeOrderActivePayload> = {},
): Promise<void> => {
  const payload = {
    ...buildDefaultOrderStatusPayload(),
    ...overrides,
  };

  await putToSiriusApi<unknown>(
    page,
    `/supervision-api/v1/orders/${orderId}/status`,
    payload,
  );
};
