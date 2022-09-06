import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { DETAILFIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: DETAILFIELD.RUN_SNO,
    dataType: ValueType.NUMBER,
    headerText: "실행 일련번호",
    width: 20,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.MENU_SNO,
    dataType: ValueType.NUMBER,
    headerText: "메뉴 일련번호",
    width: 100,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.PGM_ID,
    dataType: ValueType.TEXT,
    headerText: "프로그램 ID",
    width: 100,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.RUN_NAME,
    dataType: ValueType.TEXT,
    headerText: "프로그램명",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.SORT_SEQ,
    dataType: ValueType.INT,
    headerText: "정렬순서",
    width: 35,
    editable: true,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: "사용 여부",
    width: 70,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.ROW_STAT,
    dataType: ValueType.TEXT,
    headerText: "",
    width: 60,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
];
