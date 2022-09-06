import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { MODALFIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: MODALFIELD.GROUP_SNO,
    dataType: ValueType.TEXT,
    headerText: "그룹 일련번호",
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
  {
    fieldName: MODALFIELD.GROUP_NAME,
    dataType: ValueType.TEXT,
    headerText: "그룹명",
    width: 250,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: MODALFIELD.SYSTEM_TYPE,
    dataType: ValueType.TEXT,
    headerText: "시스템 유형",
    width: 150,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: MODALFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: "사용 여부",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: MODALFIELD.REMARK,
    dataType: ValueType.TEXT,
    headerText: "그룹 설명",
    width: 420,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
];
