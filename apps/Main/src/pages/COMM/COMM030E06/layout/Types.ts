export type MasterGridRowDataType = {
  group_sno: string;
  group_name: string;
  system_type: string;
  use_yn: string;
  remark: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailTreeGridRowDataType = {
  system_type: string;
  group_sno: number;
  parent_menu_tree_sno: string;
  menu_tree_sno: string;
  menu_sno: number;
  run_sno: number;
  menu_name: string;
  system_code: string;
  menu_type: string;
  pgm_type: string;
  pgm_id: string;
  pgm_url: string;
  sort_seq: number;
  pgm_param: string;
  use_yn: string;
  select_yn: string;
  print_yn: string;
  save_yn: string;
  custom_yn: string;
  auth_kind: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailSubGridRowDataType = {
  group_sno: string;
  user_id: string;
  user_name: string;
  user_level: string;
  emp_no: string;
  remark: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  toSave: () => any[];
  setRowData: (data: any) => void;
};

export type DetailTreeGridHandler = Handler & {
  toSave: () => any[];
  submit: () => DetailTreeGridRowDataType[];
  setRowData: (data: any) => void;
  getProgramList: (data: any) => void;
  changeData: () => number;
};

export type DetailGridHandler = Handler & {
  toSave: () => any[];
  changeData: () => number;
};

export type SearchHandler = Handler & {
  submit: () => void;
};
