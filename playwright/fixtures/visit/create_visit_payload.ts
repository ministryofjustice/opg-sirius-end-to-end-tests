export interface VisitOption {
  handle: string;
  label: string;
}

export interface VisitPayload {
  visitType: VisitOption;
  visitSubType: VisitOption;
  visitUrgency: VisitOption;
  whoToVisit: VisitOption;
  visitReportDueDate?: string;
}

export const buildMinimalVisitPayload = (): VisitPayload => ({
  visitType: {
    handle: "VT-SUP",
    label: "Supervision",
  },
  visitSubType: {
    handle: "VST-PRO",
    label: "Pro Visit",
  },
  visitUrgency: {
    handle: "VU-STAN",
    label: "Standard",
  },
  whoToVisit: {
    handle: "VPT-CLIENT",
    label: "Client",
  },
});
