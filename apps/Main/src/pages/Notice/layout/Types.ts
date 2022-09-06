export type MasterGridRowDataType = {
  article_sno: number;
  corp_code: string;
  busi_place: string;
  board_all_yn?: string;
  board_type?: string;
  system_type: string | null;
  title?: string | null;
  write_date?: string | null;
  write_user_id?: string | null;
  write_user_name?: string;
  article_ctnt?: string | null;
  attach_group_id?: string | null;
  attach_filename?: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type SearchRowDataType = {
  busi_place: string | null;
  corp_code: string | null;
  board_all_yn?: string | null;
  board_type?: string | null;
  title?: string | null;
  system_type: string | null;
  write_user_name?: string | null;
  write_date_fr?: string | null;
  write_date_to?: string | null;
};
