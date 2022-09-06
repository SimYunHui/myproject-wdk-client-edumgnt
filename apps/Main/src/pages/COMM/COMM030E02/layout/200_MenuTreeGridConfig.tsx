import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: FIELD.MENU_SNO,
    dataType: ValueType.NUMBER,
    headerText: "메뉴 일련번호",
    width: 100,
    editable: false,
    visible: false,
  },
  {
    fieldName: FIELD.MENU_NAME,
    dataType: ValueType.TEXT,
    headerText: "메뉴명",
    width: 125,
    editable: true,
    visible: true,
  },
  {
    fieldName: FIELD.SYSTEM_TYPE,
    dataType: ValueType.TEXT,
    headerText: "시스템유형",
    width: 50,
    editable: true,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.PARENT_MENU_SNO,
    dataType: ValueType.NUMBER,
    headerText: "부모 메뉴 일련번호",
    width: 200,
    editable: false,
    visible: false,
  },
  {
    fieldName: FIELD.SORT_SEQ,
    dataType: ValueType.NUMBER,
    headerText: "정렬순서",
    width: 50,
    editable: true,
    visible: false,
  },
  {
    fieldName: FIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: "사용여부",
    width: 45,
    editable: false,
    visible: true,
  },
  {
    fieldName: FIELD.TREE_ID,
    dataType: ValueType.NUMBER,
    headerText: "트리 id",
    width: 100,
    editable: false,
    visible: false,
  },
  {
    fieldName: FIELD.TREE_LEVEL,
    dataType: ValueType.NUMBER,
    headerText: "트리 level ",
    width: 200,
    editable: false,
    visible: false,
  },
  {
    fieldName: FIELD.ROW_STAT,
    dataType: ValueType.TEXT,
    width: 100,
    editable: false,
    headerText: "",
    visible: false,
  },
];
