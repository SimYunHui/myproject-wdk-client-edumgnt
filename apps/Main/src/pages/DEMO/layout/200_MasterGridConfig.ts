import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";

import { FIELD } from "./constants";
import { GridConfigType } from "./Types";

export const Config: GridConfigType[] = [
  {
    fieldName: FIELD.EMP_NO,
    dataType: ValueType.TEXT,
    headerText: "사번",
    header: {
      text: "사번",
    },
    width: 70,
    editable: false,
    visible: true,
  },
  {
    fieldName: FIELD.CORP_CODE,
    visible: false,
  },
  {
    fieldName: FIELD.BUSI_PLACE,
    visible: false,
  },
  {
    fieldName: FIELD.EMP_NAME,
    dataType: ValueType.TEXT,
    headerText: "성명",
    header: {
      text: "성명",
    },
    editor: {
      type: "line",
      maxLength: 25,
    },
    width: 70,
    editable: true,
    visible: true,
  },
  {
    fieldName: FIELD.PLANT_CODE,
    dataType: ValueType.TEXT,
    headerText: "부서/공장",
    header: {
      text: "부서/공장",
    },
    width: 120,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
    isBtnAct: true,
  },
  {
    fieldName: FIELD.EQUIP_CODE,
    dataType: ValueType.TEXT,
    headerText: "설비",
    header: {
      text: "설비",
    },
    width: 120,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: FIELD.UNIT_WORK_NO,
    visible: false,
  },
  {
    fieldName: FIELD.UNIT_WORK_CODE,
    dataType: ValueType.TEXT,
    headerText: "직무",
    header: {
      text: "직무",
    },
    width: 150,
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: FIELD.TEL_NO,
    dataType: ValueType.TEXT,
    headerText: "전화번호",
    header: {
      text: "전화번호",
    },
    width: 120,
    editable: true,
    editor: {
      type: "line",
      inputCharacters: "0-9",
      maxLength: 11,
    },
    visible: true,
  },
  {
    fieldName: FIELD.MOBILE_NO,
    dataType: ValueType.TEXT,
    headerText: "휴대전화번호",
    header: {
      text: "휴대전화번호",
    },
    width: 120,
    editable: true,
    editor: {
      type: "line",
      inputCharacters: "0-9",
      maxLength: 11,
    },
    visible: true,
  },
  {
    fieldName: FIELD.EMAIL,
    dataType: ValueType.TEXT,
    headerText: "이메일",
    header: {
      text: "이메일",
    },
    width: 200,
    editor: {
      maxLength: 50,
    },
    editable: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: FIELD.ENT_DATE,
    dataType: ValueType.DATE,
    headerText: "입사일자",
    datetimeFormat: "yyyy-MM-dd",
    header: {
      text: "입사일자",
    },
    width: 100,
    editable: true,
    editor: {
      type: "date",
      datetimeFormat: "yyyy-MM-dd",
    },
    visible: true,
  },
  {
    fieldName: FIELD.GENDER,
    dataType: ValueType.TEXT,
    headerText: "성별",
    header: {
      text: "성별",
    },
    width: 60,
    editable: true,
    visible: true,
  },
  {
    fieldName: FIELD.BIRTHDAY,
    dataType: ValueType.DATE,
    headerText: "생년월일",
    datetimeFormat: "yyyy-MM-dd",
    header: {
      text: "생년월일",
    },
    width: 100,
    editable: true,
    editor: {
      type: "date",
      datetimeFormat: "yyyy-MM-dd",
    },
    visible: true,
  },
  {
    fieldName: FIELD.BIRTHDAY_TYPE,
    visible: false,
  },
  {
    fieldName: FIELD.RESPONSI,
    dataType: ValueType.TEXT,
    headerText: "직책",
    header: {
      text: "직책",
    },
    width: 90,
    editable: true,
    visible: true,
  },
  {
    fieldName: FIELD.ON_WORK_YN,
    dataType: ValueType.TEXT,
    headerText: "재직여부",
    header: {
      text: "재직여부",
    },
    width: 90,
    editable: true,
    visible: true,
  },
  {
    fieldName: FIELD.USER_ID,
    visible: false,
  },
  {
    fieldName: FIELD.ROW_STAT,
    visible: false,
  },
];
