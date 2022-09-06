import { ReactNode } from 'react';
import { ValueType } from 'realgrid';

export type RowDataType = {
  cm_code_type_id: string;
  cm_code_type_name: string;
  parent_code_type_id: string;
  cm_code_length: number;
  system_yn: string;
  delete_yn: string;
  remark: string;
};

export type DetailRowDataType = {
  cm_code_type_id: string;
  detail_code_id: string;
  detail_code_name: string;
  sort_seq: number;
  use_yn: string;
  etc_ctnt1: string;
  etc_ctnt2: string;
  etc_ctnt3: string;
  etc_ctnt4: string;
  etc_ctnt5: string;
  etc_desc: string;
  valid_start_date: string;
  valid_end_date: string;
};

export type MasterGridProps = {
  title: string;
  originRows: RowDataType[];
  onSelectRow?: (data: any) => void;
  setIsChanged?: any; //() => void;
  cleanupOther?: () => void;
  onRowState?: () => number;
  ref?: ReactNode;
};

export type DetailGridProps = {
  title: string;
  originRows: DetailRowDataType[];
  relationFields?: any;
  setIsChanged?: any;
  ref?: ReactNode;
};

export type SearchProps = {
  onSubmit?: (data: any, noneFlag?: any) => void;
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
  toSave: () => RowDataType[];
};

export type DetailGridHandler = Handler & {
  toSave: () => DetailRowDataType[];
  changeData: () => number;
};

export type SearchHandler = Handler & {
  submit: () => void;
};
