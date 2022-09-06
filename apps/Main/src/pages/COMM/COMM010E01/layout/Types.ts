export type MasterGridRowDataType = {
  user_id?: string;
  user_name?: string;
  system_type?: string;
  user_level?: string;
  use_yn?: string;
  emp_no?: string | null;
  tel_no?: string | null;
  email?: string | null;
  remark?: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type FirstDetailGridRowDataType = {
  user_id: string;
  group_sno: string;
  group_name: string;
  system_type: string;
  use_yn: string;
  remark: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type SecondDetailGridRowDataType = {
  role_no?: string;
  role_type?: string;
  role_name?: string;
  system_yn?: string;
  use_yn?: string;
  remark?: string | null;
  user_id?: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  toSave: () => MasterGridRowDataType[];
};

export type FirstDetailGridHandler = Handler & {
  toSave: () => FirstDetailGridRowDataType[];
  changeData: () => number;
};

export type SecondDetailGridHandler = Handler & {
  toSave: () => SecondDetailGridRowDataType[];
  changeData: () => number;
};

export type SearchHandler = Handler & {
  submit: () => void;
};

export type ModalHandler = Handler & {
  confirm: () => void;
};

export type FormProps = {
  search_text: string;
  user_level: string;
  use_yn: string;
};

export type FirstSearchProps = {
  search_text: string;
};

export type SecondSearchProps = {
  search_text: string;
};
