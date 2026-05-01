import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";

interface SupervisionLevelPayload {
  appliesFrom: string;
  newAssetLevel: string;
  newLevel: string;
  notes: string;
}

const buildDefaultSupervisionLevelPayload = (): SupervisionLevelPayload => ({
  appliesFrom: "23/03/2023",
  newAssetLevel: "LOW",
  newLevel: "GENERAL",
  notes: "",
});

export const addSupervisionLevel = async (
  page: Page,
  orderId: number,
  overrides: Partial<SupervisionLevelPayload> = {},
): Promise<void> => {
  const payload = {
    ...buildDefaultSupervisionLevelPayload(),
    ...overrides,
  };

  await postToSiriusApi<unknown>(
    page,
    `/supervision-api/v1/orders/${orderId}/supervision-level`,
    payload,
  );
};
