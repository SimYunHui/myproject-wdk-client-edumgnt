export type GridDataType = {
  rep_busi_place_yn: string;
  corp_code: string;
  busi_place: string;
  business_no: string;
  busi_place_name: string;
  busi_place_name_en: string;
  busi_place_sht_name: string;
  president: string;
  president_en: string;
  biz_type: string;
  biz_item: string;
  zip_code: string;
  addr: string;
  addr_en: string;
  tel_no: string;
  fax_no: string;
  tax_office_code: string;
  hometax_id: string;
  slave_busi_no: string;
  sum_recog_no: string;
  prsd_sec_no: string;
  homepage: string;
  cust_code: string;
  item_code: string;
  biz_date: Date;
  remark: string;
  busi_part: string;
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
