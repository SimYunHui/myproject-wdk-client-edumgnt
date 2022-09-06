import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { MODALSUBFIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: MODALSUBFIELD.USER_ID,
    dataType: ValueType.TEXT,
    headerText: "사용자ID",
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: MODALSUBFIELD.USER_NAME,
    dataType: ValueType.TEXT,
    headerText: "사용자명",
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: MODALSUBFIELD.USER_LEVEL,
    dataType: ValueType.TEXT,
    headerText: "레벨",
    width: 130,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: MODALSUBFIELD.EMP_NO,
    dataType: ValueType.TEXT,
    headerText: "사원번호",
    width: 80,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: MODALSUBFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: "사용 여부",
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: MODALSUBFIELD.EMAIL,
    dataType: ValueType.TEXT,
    headerText: "",
    width: 180,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },

  {
    fieldName: MODALSUBFIELD.REMARK,
    dataType: ValueType.TEXT,
    headerText: "비고",
    width: 250,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
];
