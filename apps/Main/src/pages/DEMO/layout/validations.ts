import * as yup from "yup";
import { requiredMessage } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "./constants";

export const mobileRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
export const telRegExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
export const emailRegEzp =
  // eslint-disable-next-line
  /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;

export const searchValidation = yup.object({
  [FIELD.EMP_NAME]: yup
    .string()
    .test("max", "성명" + requiredMessage.MAX10, (val) => val.length < 10),
});
