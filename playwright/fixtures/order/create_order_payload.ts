export interface OrderPayload {
  caseSubtype: string;
  orderSubtype: {
    handle: string;
    label: string;
  };
  caseRecNumber: string;
  orderDate: string;
  orderIssueDate: string;
  orderStatus: string;
  statusDate: string;
  orderExpiryDate: string;
  receiptDate: string;
  title: string;
  fileLocationDescription: string;
  fileLocationAddress: {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    town: string;
    postcode: string;
    county: string;
    country: string;
    isAirmailRequired: boolean;
  };
  howDeputyAppointed: string;
  orderNotes: string;
  clauseExpiryDate: string;
  bondReferenceNumber: string;
  bondValue: number;
}

export const buildMinimalOrderPayload = (): OrderPayload => ({
  caseSubtype: "PFA",
  orderSubtype: {
    handle: "NEW DEPUTY",
    label: "New deputy",
  },
  caseRecNumber: "00000000",
  orderDate: "01/01/2021",
  orderIssueDate: "",
  orderStatus: "",
  statusDate: "",
  orderExpiryDate: "",
  receiptDate: "01/01/2021",
  title: "",
  fileLocationDescription: "",
  fileLocationAddress: {
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    town: "",
    postcode: "",
    county: "",
    country: "",
    isAirmailRequired: false,
  },
  howDeputyAppointed: "",
  orderNotes: "",
  clauseExpiryDate: "",
  bondReferenceNumber: "",
  bondValue: 0,
});
