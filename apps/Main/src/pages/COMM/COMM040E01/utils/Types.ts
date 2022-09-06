export type GridDataType = {
  rep_corp_yn: string;
  corp_code: string;
  corp_no: string;
  corp_name: string;
  corp_name_en: string;
  corp_sht_name: string;
  president: string;
  president_en: string;
  prsd_sec_no: string;
  biz_type: string;
  biz_item: string;
  tel_no: string;
  fax_no: string;
  zip_code: string;
  addr: string;
  addr_en: string;
  foundation_date: Date;
  remark: string;
  first_rg_yms: string;
  first_rg_idf: string;
  last_update_yms: string;
  last_update_idf: string;
  row_stat: string;
  __rowState?: string;
};

type Handler = {
  cleanup: () => void;
};

export type MasterGridHandler = Handler;

export type MasterGridProps = {
  originRows: GridDataType[];
  row: GridDataType;
  onAddRow?: () => void;
  ref?: React.ReactNode;
  onSelectRow?: any;
  onSetGridValue?: any;
  onSubmit?: () => void;
};

export type SearchFormHandler = Handler & {
  submit: () => void;
  getValues: (name?: keyof FormProps) => any;
};

export type FormProps = {
  search_text: string;
};
