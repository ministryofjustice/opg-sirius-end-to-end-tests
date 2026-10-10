export interface DraftPayload {
  templateId: string;
  correspondents: [
    {
      id: number;
      personType: string;
    },
  ];
  inserts: string[];
  secondaryRecipients: string[];
}

export const buildDraftPayload = (): Partial<DraftPayload> => ({
  templateId: "blank",
  inserts: [],
  secondaryRecipients: [],
});
