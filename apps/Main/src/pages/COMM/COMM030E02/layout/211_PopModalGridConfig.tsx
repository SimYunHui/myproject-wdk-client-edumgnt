import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { MODALFIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: MODALFIELD.PGM_ID,
    dataType: ValueType.TEXT,
    headerText: "프로그램 ID",
    width: 100,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: MODALFIELD.PGM_NAME,
    dataType: ValueType.TEXT,
    headerText: "프로그램명",
    width: 200,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: MODALFIELD.PGM_TYPE,
    dataType: ValueType.TEXT,
    headerText: "프로그램유형",
    width: 100,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: MODALFIELD.PGM_URL,
    dataType: ValueType.TEXT,
    headerText: "프로그램URL",
    width: 170,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: MODALFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: "사용여부",
    width: 60,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
];
