export const FIELD = {
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  PWD: 'pwd',
  PWD_NEW: 'pwd_new',
  PWD_CHK: 'pwd_chk',
  USER_LEVEL: 'user_level',
  USE_YN: 'use_yn',
  EMP_NO: 'emp_no',
  TEL_NO: 'tel_no',
  MOBILE_NO: 'mobile_no',
  EMAIL: 'email',
  REMARK: 'remark',
  BUSI_PLACE: 'busi_place',
  BUSI_PLACE_NAME: 'busi_place_name',
  EQUIP_CODE: 'equip_code',
  EQUIP_NAME: 'equip_name',
  PLANT_CODE: 'plant_code',
  PLANT_NAME: 'plant_name',
  UNIT_WORK_CODE: 'unit_work_code',
  UNIT_WORK_NAME: 'unit_work_name',
  UNIT_WORK_NO: 'unit_work_no',
  RESPONSI: 'responsi',
  RESPONSI_NAME: 'responsi_name',
  ROW_STAT: 'row_stat',
};

export const FIRSTDETAILFIELD = {
  USER_ID: 'user_id',
  GROUP_SNO: 'group_sno',
  GROUP_NAME: 'group_name',
  SYSTEM_TYPE: 'system_type',
  USE_YN: 'use_yn',
  REMARK: 'remark',
};

export const SECONDDETAILFIELD = {
  USER_ID: 'user_id',
  ROLE_NO: 'role_no',
  ROLE_TYPE: 'role_type',
  ROLE_NAME: 'role_name',
  SYSTEM_YN: 'system_yn',
  USE_YN: 'use_yn',
  REMARK: 'remark',
};

export type FirstDetailGridRowDataType = {
  group_sno: number;
  group_name: string;
  system_type: string;
  use_yn: string;
  remark?: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};

export type SecondDetailGridRowDataType = {
  user_id: string;
  role_no: string;
  role_type: string;
  role_name: string;
  system_yn: string;
  use_yn: string | null;
  remark: string | null;
  row_stat?: 'added' | 'unchanged' | 'modified' | 'deleted';
};
