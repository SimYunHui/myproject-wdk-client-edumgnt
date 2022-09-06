import { ValueType } from "realgrid";
import { SECONDDETAILFIELD } from "./constants";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
export const Config = [
  {
    fieldName: SECONDDETAILFIELD.USER_ID,
    dataType: ValueType.TEXT,
    header: {
      text: "사용자 ID",
    },
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: false,
    readonly: true,
  },
  {
    fieldName: SECONDDETAILFIELD.ROLE_NO,
    dataType: ValueType.TEXT,
    header: {
      text: "Role 번호",
    },
    width: 90,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
    readonly: true,
  },
  {
    fieldName: SECONDDETAILFIELD.ROLE_TYPE,
    dataType: ValueType.TEXT,
    header: {
      text: "Role 유형",
    },
    width: 100,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    editable: false,
    visible: true,
    readonly: true,
  },
  {
    fieldName: SECONDDETAILFIELD.ROLE_NAME,
    dataType: ValueType.TEXT,
    header: {
      text: "Role 명",
    },
    width: 150,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
    readonly: true,
  },
  {
    fieldName: SECONDDETAILFIELD.SYSTEM_YN,
    dataType: ValueType.TEXT,
    header: {
      text: "시스템 여부",
    },
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
    readonly: true,
  },
  {
    fieldName: SECONDDETAILFIELD.USE_YN,
    dataType: ValueType.TEXT,
    header: {
      text: "사용 여부",
    },
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
    readonly: true,
  },
  {
    fieldName: SECONDDETAILFIELD.REMARK,
    dataType: ValueType.TEXT,
    header: {
      text: "비고",
    },
    width: 150,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
    readonly: true,
  },
];
