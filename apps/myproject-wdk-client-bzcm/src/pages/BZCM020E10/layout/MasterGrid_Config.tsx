import { ValueType } from "realgrid";
export const GridConfig = [
  {
    fieldName: "report_no",
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: "report_write_date",
    dataType: ValueType.DATE,
    visible: true,
    headerText: "작성일자",
    datetimeFormat: "yyyy-MM-dd",
  },
  {
    fieldName: "emp_name",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "담당자",
  },
  {
    fieldName: "exec_ctnt",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "금일 실시 내용",
  },
  {
    fieldName: "plan_ctnt",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: "명일 계획 내용",
  },
  {
    fieldName: "remark",
    dataType: ValueType.TEXT,
    visible: true,
    headerText: " 비고",
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