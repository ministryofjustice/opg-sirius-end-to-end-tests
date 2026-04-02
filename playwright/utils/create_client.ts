import { type BrowserContext, type Page } from "@playwright/test";
import { randomText } from "./random_text";
import { postToSiriusApi } from "./sirius_api";

interface ClientPayload {
  salutation: string;
  firstname: string;
  middlenames: string;
  surname: string;
  dob: string;
  previousNames: string;
  email: string;
  caseRecNumber: string;
  clientAccommodation: string;
  medicalCondition: string;
  memorablePhrase: string;
  maritalStatus: string;
  clientStatus: string;
  statusDate: string;
  correspondenceByPost: string;
  correspondenceByEmail: string;
  correspondenceByPhone: string;
  correspondenceByWelsh: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  postcode: string;
  county: string;
  country: string;
  isAirmailRequired: string;
  phoneNumber: string;
  interpreterRequired: string;
  specialCorrespondenceRequirements: {
    audioTape: string;
    largePrint: string;
    hearingImpaired: string;
    spellingOfNameRequiresCare: string;
  };
}

interface CreatedClient {
  id: number;
  caseRecNumber: string;
  firstname: string;
  surname: string;
}

const buildMinimalClientPayload = (): ClientPayload => ({
  salutation: "",
  firstname: randomText(),
  middlenames: "",
  surname: randomText(),
  dob: "",
  previousNames: "",
  email: "",
  caseRecNumber: "00000000",
  clientAccommodation: "",
  medicalCondition: "",
  memorablePhrase: "",
  maritalStatus: "",
  clientStatus: "",
  statusDate: "",
  correspondenceByPost: "",
  correspondenceByEmail: "",
  correspondenceByPhone: "",
  correspondenceByWelsh: "",
  addressLine1: "1 Road Street",
  addressLine2: "",
  addressLine3: "",
  town: "Town",
  postcode: "PS1 2CD",
  county: "",
  country: "",
  isAirmailRequired: "",
  phoneNumber: "",
  interpreterRequired: "",
  specialCorrespondenceRequirements: {
    audioTape: "",
    largePrint: "",
    hearingImpaired: "",
    spellingOfNameRequiresCare: "",
  },
});

export const createClient = async (
  page: Page,
  context: BrowserContext,
): Promise<CreatedClient> => {
  const payload = buildMinimalClientPayload();

  return await postToSiriusApi<CreatedClient>(
    page,
    context,
    "/api/v1/clients",
    payload,
  );
};

