import { randomText } from "../../utils/random_text";

export interface DeputyPayload {
  salutation: string;
  firstname: string;
  otherNames: string;
  surname: string;
  previousNames: string;
  workPhoneNumber: string;
  mobileNumber: string;
  homePhoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  town: string;
  postcode: string;
  county: string;
  country: string;
  isAirmailRequired: boolean;
  dob: string;
  deputyType: {
    handle: string;
    label: string;
  };
  organisationName: string;
}

export const buildMinimalDeputyPayload = (): DeputyPayload => ({
  salutation: "Mr",
  firstname: randomText(),
  otherNames: "",
  surname: randomText(),
  previousNames: "",
  workPhoneNumber: "(0121) 071 5088",
  mobileNumber: "01234 123 4567",
  homePhoneNumber: "",
  email: "asdf@asdf.cee",
  addressLine1: "Leslie Mantle Rest House",
  addressLine2: "65 Parade",
  addressLine3: "",
  town: "Birmingham",
  postcode: "B1 3QQ",
  county: "Birmingham",
  country: "UK",
  isAirmailRequired: false,
  dob: "",
  deputyType: { handle: "LAY", label: "Lay" },
  organisationName: "",
});
