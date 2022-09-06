import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { DETAILSUBFIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: DETAILSUBFIELD.RUN_SNO,
    dataType: ValueType.NUMBER,
    headerText: "실행 일련번호",
    width: 100,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILSUBFIELD.PARAM_NAME,
    dataType: ValueType.TEXT,
    headerText: "Param 이름",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.PARAM_VALUE,
    dataType: ValueType.TEXT,
    headerText: "Param 값",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.REMARK,
    dataType: ValueType.TEXT,
    headerText: "",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.ROW_STAT,
    dataType: ValueType.TEXT,
    headerText: "",
    width: 60,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
];
