import { ValueType } from "realgrid";

// 마스터 그리드의 컬럼을 기술한다. 
// 아래 5개 컬럼은 필수값 (백엔드에서 필요, 모든 테이블에 extend 되어 있음)
// first_rg_yms, first_rg_idf, last_update_yms, last_update_idf, row_stat

export const GridConfig = [
  {
    fieldName: "emp_no",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "사번",
  },
  {
    fieldName: "emp_name",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "성명",
  },
  {
    fieldName: "user_id",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "ID",
  },
  {
    fieldName: "dept_code",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "부서코드",
  },
  {
    fieldName: "job",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "직무",
  },
  {
    fieldName: "responsi",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "직책",
  },
  {
    fieldName: "phon_number",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "전화번호",
  },
  {
    fieldName: "email",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "이메일",
  },
  {
    fieldName: "use_yn",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "사용여부",
  },
  {
    fieldName: "first_rg_yms",
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: "first_rg_idf",
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: "last_update_yms",
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: "last_update_idf",
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: "row_stat",
    dataType: ValueType.TEXT,
    visible: false,
  },
];