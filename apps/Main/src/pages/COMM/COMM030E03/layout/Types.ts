export type MasterGridRowDataType = {
  role_no: string;
  role_type: string;
  role_name: string;
  system_yn: string;
  use_yn?: string | null;
  remark: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailGridRowDataType = {
  user_id: string;
  user_name: string;
  user_level: string;
  remark: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type ModalGridRowDataType = {
  user_id: string;
  user_name: string;
  user_level: string;
  use_yn: string;
  emp_no: string;
  tel_no: string;
  email: string;
  remark: string;
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  toSave: () => MasterGridRowDataType[];
};

export type DetailGridHandler = Handler & {
  toSave: () => DetailGridRowDataType[];
  changeData: () => number;
};

export type SearchHandler = Handler & {
  submit: () => void;
};

export type ModalHandler = Handler & {
  confirm: () => void;
};
