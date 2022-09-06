export type MasterGridRowDataType = {
  user_id: string;
  user_name: string;
  user_level: string;
  emp_no: string;
  use_yn: string | null;
  remark: string | null;
  email: string;
  tel_no: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailGridRowDataType = {
  role_no: string;
  role_type: string;
  role_name: string;
  system_yn: string;
  use_yn: string;
  remark: string;
  user_id: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
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
