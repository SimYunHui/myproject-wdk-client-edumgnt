import { ValueType } from 'realgrid';

export type MasterGridRowDataType = {
  system_code: string;
  system_group_code: string;
  url: string;
  system_group_name: string;
  use_yn: string | null;
  remark?: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailGridRowDataType = {
  pgm_id: string;
  pgm_name: string;
  pgm_type: string;
  pgm_url: string;
  use_yn: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
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
  button?: string;
  isBtnAct?: string;
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
  editor?: { [name: string]: string | boolean | number | { [name: string]: string } };
  displayCallback?: (grid: any, index: any, value: any) => undefined | Date | number | string;
  styleCallback?: (grid: any, dataCell: any) => { styleName: string };
};
type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  toSave: () => void;
  submit: () => MasterGridRowDataType[];
};

export type DetailGridHandler = Handler & {
  toSave: () => void;
  submit: () => DetailGridRowDataType[];
  changeData: () => number;
  getSystemCode: (data: any) => void;
};

export type SearchHandler = Handler & {
  submit: () => void;
};

export type ModalHandler = Handler & {
  confirm: () => void;
};
