import { randomText } from "../../utils/random_text";

class ContactPayload {
  salutation: string;
  firstname: string;
  otherNames: string;
  surname: string;
  companyName: string;
  companyReference: string;
  daytimeTelephoneNumber: string;
  mobileTelephoneNumber: string;
  emailAddress: string;
  notes: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  postcode: string;
  county: string;
  country: string;
  isAirmailRequired: string;
  correspondenceByPost: string;
  correspondenceByEmail: string;
  correspondenceByPhone: string;
  correspondenceByWelsh: string;
  interpreterRequired: string;
  isOrganisation: boolean;
  correspondenceName: string;
  specialCorrespondenceRequirements: {
    audioTape: string;
    largePrint: string;
    hearingImpaired: string;
    spellingOfNameRequiresCare: string;
  };
  isExecutor: string;
}

export const buildMinimalContactPayload = (): ContactPayload => ({
  salutation: "Mr",
  firstname: randomText(),
  otherNames: "",
  surname: randomText(),
  companyName: "",
  companyReference: "",
  daytimeTelephoneNumber: "",
  mobileTelephoneNumber: "",
  emailAddress: "",
  notes: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  town: "",
  postcode: "",
  county: "",
  country: "",
  isAirmailRequired: "",
  correspondenceByPost: "",
  correspondenceByEmail: "",
  correspondenceByPhone: "",
  correspondenceByWelsh: "",
  interpreterRequired: "",
  isOrganisation: false,
  correspondenceName: "",
  specialCorrespondenceRequirements: {
    audioTape: "",
    largePrint: "",
    hearingImpaired: "",
    spellingOfNameRequiresCare: "",
  },
  isExecutor: "",
});
