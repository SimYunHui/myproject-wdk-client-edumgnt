export type DetailGridRowDataType = {
  user_id: string;
  menu_sno: number;
  menu_name: string;
  parent_menu_sno: number;
  sort_seq: number;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type DetailSubGridRowDataType = {
  user_id: string;
  run_name: string;
  menu_sno: string;
  run_sno: string;
  sort_seq: string;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler & {
  toSave: () => any[];
  setRowData: (data: any) => void;
};

export type DetailGridHandler = Handler & {
  toSave: () => DetailGridRowDataType[];
  setRowData: (data: any) => void;
};

export type DetailSubGridHandler = Handler & {
  toSave: () => DetailSubGridRowDataType[];
  getFocusedMenuSno: (data: any) => void;
  getProgramList: (data: any) => void;
  changeData: () => number;
};

export type SearchHandler = Handler & {
  submit: () => void;
};
