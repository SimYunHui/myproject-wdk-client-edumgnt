import { ValueType } from 'realgrid';

export type DetailGroupGridRowDataType = {
  group_sno: string;
  group_name: string;
  run_sno: string;
  use_yn?: string;
  select_yn: string;
  print_yn?: string;
  save_yn?: string;
  custom_yn?: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailUserGridRowDataType = {
  user_id: string;
  user_name: string;
  use_yn: string;
  select_yn: string;
  print_yn: string;
  save_yn: string;
  custom_yn: string;
  run_sno: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  toSave: () => any[];
  setRowData: (data: any) => void;
};

export type DetailGroupGridHandler = Handler & {
  toSave: () => any[];
  changeData: () => number;
  getMenuData: (data: any) => void;
};

export type DetailUserGridHandler = Handler & {
  toSave: () => any[];
  changeData: () => number;
  getProgramList: (data: any) => void;
};

export type SearchHandler = Handler & {
  submit: () => void;
};

export type ModalHandler = Handler & {
  confirm: () => void;
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
  displayCallback?: (grid: any, index: any, value: any) => undefined | Date | number | string | boolean;
  styleCallback?: (grid: any, dataCell: any) => { styleName: string };
  valueCallback?: (prod: any, dataRow: any, fieldName: any, fieldNames: any, values: any) => undefined | number;
};
