import fs = require("fs");
import path = require("node:path");

export interface DocumentPayload {
  type: string;
  caseRecNumber: string;
  parentUuid: string;
  metadata: Record<string, unknown>;
  file: {
    name: string;
    source: string;
    type: string;
  };
}

export const buildPdfDocumentPayload = (
  caseRecNumber: string,
): DocumentPayload => {
  const pdfBase64 = fs.readFileSync(
    path.join(__dirname, "base64_test_pdf.txt"),
  );

  return {
    type: "Correspondence",
    caseRecNumber: caseRecNumber,
    parentUuid: "",
    metadata: {},
    file: {
      name: "TEST.pdf",
      source: pdfBase64.toString(),
      type: "application/pdf",
    },
  };
};
