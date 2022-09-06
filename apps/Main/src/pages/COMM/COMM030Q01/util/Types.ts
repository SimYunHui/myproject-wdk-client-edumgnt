import { ValueType } from 'realgrid';

export type MasterGridRowDataType = {
  user_id: string;
  user_name: string;
  busi_place: string;
  dept_no: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailGridRowDataType = {
  user_id: string;
  menu_name: string;
  sort_seq: string;
  system_code: string;
  pgm_id: string;
  pgm_type: string;
  use_yn: string;
  select_yn: string;
  print_yn: string;
  save_yn: string;
  custom_yn: string;
  menu_type: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  submit: () => MasterGridRowDataType[];
};

export type DetailGridHandler = Handler & {
  submit: () => DetailGridRowDataType[];
  setRowData: (data: any) => void;
};

export type SearchHandler = Handler & {
  submit: () => void;
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
