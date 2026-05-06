export interface TaskPayload {
  caseId: string;
  type: string;
  name: string;
  description: string;
  dueDate: string;
  assigneeId: number;
}

export const buildMinimalTaskPayload = (orderId: number): TaskPayload => ({
  caseId: `${orderId}`,
  type: "CWRD",
  name: "Optional Task Name",
  description: "Mandatory description",
  dueDate: "29/03/2025",
  assigneeId: 3,
});
