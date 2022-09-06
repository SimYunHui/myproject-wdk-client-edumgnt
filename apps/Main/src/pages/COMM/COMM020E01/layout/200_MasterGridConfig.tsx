import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: FIELD.CM_CODE_TYPE_ID,
    dataType: ValueType.TEXT,
    headerText: "공통 코드 유형 ID",
    width: 130,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: FIELD.CM_CODE_TYPE_NAME,
    dataType: ValueType.TEXT,
    headerText: "공통 코드 유형 명",
    width: 250,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: FIELD.PARENT_CODE_TYPE_ID,
    dataType: ValueType.TEXT,
    headerText: "상위 공통 코드 ID",
    width: 120,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: FIELD.CM_CODE_LENGTH,
    dataType: ValueType.TEXT,
    headerText: "상세 코드 길이",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTRIGHT,
    visible: true,
  },
  {
    fieldName: FIELD.SYSTEM_YN,
    dataType: ValueType.TEXT,
    headerText: "시스템 여부",
    width: 100,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: FIELD.DELETE_YN,
    dataType: ValueType.TEXT,
    headerText: "삭제 여부",
    width: 70,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: FIELD.REMARK,
    dataType: ValueType.TEXT,
    headerText: "비고",
    width: 300,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
];
