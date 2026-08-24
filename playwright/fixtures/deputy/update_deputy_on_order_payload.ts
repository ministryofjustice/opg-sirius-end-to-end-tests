export interface UpdateDeputyOnOrderPayload {
  statusOnCase: {
    handle: string;
    label: string;
  };
  statusOnCaseOverride: {
    handle: string;
    label: string;
  };
  statusChangeDate: string;
  statusNotes: string;
  deputyType: {
    handle: string;
    label: string;
  };
  relationshipToClient: string;
  relationshipOther: string;
  mainCorrespondent: boolean;
  feePayer: boolean;
}

export const buildErroredDeputyPayload = (): UpdateDeputyOnOrderPayload => ({
  statusOnCase: {
    handle: "OPEN",
    label: "Open",
  },
  statusOnCaseOverride: {
    handle: "ERROR",
    label: "Error",
  },
  statusChangeDate: "26/03/2023",
  statusNotes: "",
  deputyType: {
    handle: "LAY",
    label: "Lay",
  },
  relationshipToClient: "",
  relationshipOther: "",
  mainCorrespondent: false,
  feePayer: false,
});
