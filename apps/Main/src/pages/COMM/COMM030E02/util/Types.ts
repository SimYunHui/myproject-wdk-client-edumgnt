import { DefaultCodeSchema } from "@vntgcorp/vntg-wdk-client";
import { ValueType } from "realgrid";
// import { DefaultCodeSchema } from '../../../components/organisms/Form';

export type MasterRowDataType = {
  menu_sno: number;
  pgm_id: string;
  row_stat: string;
  run_name: string;
  run_sno: number;
  sort_seq: number;
  use_yn: string;
  first_rg_idf: string;
  first_rg_yms: string;
  last_update_idf: string;
  last_update_yms: string;
};

export type OptionalRowDataType = {
  [T in keyof MasterRowDataType]?: MasterRowDataType[T];
};

export type SearchTypes = {
  busi_place: string;
  plant_code: string;
  emp_no: string;
  occur_place: string;
  occur_type: string;
  attach_yn: string;
  date_fr: string;
  date_to: string;
};

export type GridConfigType = {
  fieldName: string;
  dataType?: ValueType;
  headerText?: string;
  header?: {
    text: string;
  };
  width?: number;
  editable?: boolean;
  textAlignment?: string;
  visible: boolean;
  datetimeFormat?: string;
  numberFormat?: string;
  footer?: {
    expression: string;
    numberFormat: string;
  };
  validations?: {
    criteria: string;
    message: string;
    mode: string;
    level: string;
  };
  textFormat?: string;
  styleName?: string;
  editor?: { [name: string]: string | boolean | { [name: string]: string } };
  displayCallback?: (
    grid: any,
    index: any,
    value: any
  ) => undefined | Date | number | string | boolean;
  styleCallback?: (grid: any, dataCell: any) => { styleName: string };
  valueCallback?: (
    prod: any,
    dataRow: any,
    fieldName: any,
    fieldNames: any,
    values: any
  ) => undefined | number;
};

export type FormProps = {
  selectBox: string;
};

export type SearchProps = {
  onSubmit: (data: any) => void;
  busiPlace: DefaultCodeSchema;
  radioOptions: DefaultCodeSchema[];
  defaultDateTo: string;
  defaultDateFrom: string;
};

export type MasterGridProps = {
  title: string;
  originRows: MasterRowDataType[];
  onSelectRow?: (data: any) => void;
  onGoToNext?: () => void;
  onAddRow?: () => void;
  ref?: React.ReactNode;
};

type Handler = {
  cleanup: () => void;
};
export type MasterGridHandler = Handler & {
  changeData: (rowIndex: number, fieldName: string, value: string) => void;
};
export type DetailSubGridHandler = Handler & {
  changeData: (rowIndex: number, fieldName: string, value: string) => void;
};

export type SearchFormHandler = Handler & {
  getValues: () => FormProps;
  submit: () => void;
};

export type DetailFormHandler = Handler & {
  getValues: (name: string) => MasterRowDataType;
  submit: () => void;
};
