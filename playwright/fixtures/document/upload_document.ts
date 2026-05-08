import { type Page } from "@playwright/test";
import {
  buildPdfDocumentPayload,
  DocumentPayload,
} from "./create_document_payload";
import { postToSiriusApi } from "../../utils/sirius_api";

export const uploadDocumentForClient = async (
  page: Page,
  caseRecNumber: string,
): Promise<void> => {
  await postToSiriusApi<DocumentPayload>(
    page,
    "/api/public/v1/documents",
    buildPdfDocumentPayload(caseRecNumber),
  );
};
