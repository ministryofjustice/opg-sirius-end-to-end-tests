import { type Page } from "@playwright/test";
import { postToSiriusApi } from "../../utils/sirius_api";
import {
  buildMinimalTaskPayload,
  type TaskPayload,
} from "./create_task_payload";

export interface CreatedTask {
  id: number;
}

export const createTaskForOrder = async (
  page: Page,
  orderId: number,
  overrides: Partial<TaskPayload> = {},
): Promise<CreatedTask> => {
  const payload = {
    ...buildMinimalTaskPayload(orderId),
    ...overrides,
  };

  return postToSiriusApi<CreatedTask>(
    page,
    "/supervision-api/v1/tasks",
    payload,
  );
};
