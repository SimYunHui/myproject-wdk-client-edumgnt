export type MasterGridRowDataType = {
  group_sno: number;
  group_name: string;
  system_type: string;
  use_yn: string;
  remark?: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailGridRowDataType = {
  group_sno?: number;
  user_id?: string;
  user_name?: string;
  user_level?: string;
  emp_no?: string;
  remark?: string | null;
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
  confirm: () => [];
};

export type FormProps = {
  search_text: string;
  use_yn: string;
};

export type ModalSearchFormProps = {
  search_text: string;
  use_yn: string;
};
