import React, { ReactNode } from 'react';
import { ValueType } from 'realgrid';

export type RowDataType = {
  emp_no: string;
  busi_place: string;
  corp_code: string;
  emp_name: string;
  dept_code: string;
  unit_work_no: string;
  plant_code: string;
  equip_code: string;
  unit_work_code: string;
  tel_no: string;
  mobile_no: string;
  email: string;
  ent_date: null;
  birthday: string;
  birthday_type: string;
  responsi: string;
  on_work_yn: 'Y' | 'N';
  user_id: string;
  row_stat: string;
  __rowState?: string;
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
  isBtnAct?: boolean;
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
  displayCallback?: (grid, index, value) => undefined | Date | number | string;
  styleCallback?: (grid, dataCell) => { styleName: string };
};

export type FormProps = {
  busi_place: string;
  emp_name: string;
  task_plant_code: string;
  task_equip_code: string;
  task_unit_work_code: string;
};

export type MasterGridProps = {
  title: string;
  busiCode: string;
  originRows: RowDataType[];
  onSelectRow?: (data?) => void;
  saveData?: RowDataType[];
  styles?: React.CSSProperties;
  gotoNext?: () => void;
  onAddRow?: () => void;
  ref?: ReactNode;
  onSetUnitWorkNumber: (plant, equip, unit) => void;
};

export type SearchProps = {
  onChangeBusiCode: (name, value) => void;
  busiCode: string;
  defaultBusiCode: string;
  onSubmit?: (data, noneFlag?) => void;
  ref: ReactNode;
};

export type ForwardFunc = {
  cleanup: () => void;
  submit: (noneFlag?: boolean) => void;
  getValues: (name?: string) => FormProps | string;
  setValues: (name: Partial<FormProps>) => void;
};
