export class Visits {
  addVisit = {
    visitType: null,
    visitSubType: null,
    visitUrgency: null,
    visitDueDate: null
  };

  editVisit = {
    whoToVisit: null,
    visitDueDate: null,
    visitCancellationReason: null,
    visitCommissionDate: null,
    visitCompletedDate: null,
    visitOutcome: null,
    visitReportDueDate: null,
    visitReportMarkedAs: null,
    visitReportReceivedDate: null,
    visitReportReviewedDate: null,
    visitVisitorAllocated: null,
    visitAssuranceDecision: null
  };

  createAddVisitMinimalValues(includeOptional) {
    this.addVisit.visitType = { handle: 'VT-SUP', label: 'Supervision' };
    this.addVisit.visitSubType = { handle: 'VST-PRO', label: 'Pro Visit' };
    this.addVisit.visitUrgency = { handle: 'VU-STAN', label: 'Standard' };
    this.addVisit.DueDate = (includeOptional ? new Date().toLocaleString('en-GB') : null);

    return this.addVisit;
  }

  createEditVisitReportDue() {
    this.editVisit.whoToVisit = { handle: 'VPT-Client', label: 'Client' };
    this.editVisit.visitReportDueDate = new Date().toLocaleString('en-GB');

    return this.editVisit;
  }
}
