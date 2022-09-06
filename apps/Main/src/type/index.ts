import { ClickData } from "realgrid";

export type IClickData = ClickData & {
  column: string;
  dataRow: number;
  editable: boolean;
  fieldName: string;
  readOnly: boolean;
  type: string;
};
