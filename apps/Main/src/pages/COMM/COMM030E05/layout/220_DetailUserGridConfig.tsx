import { ValueType } from "realgrid";
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { DETAILSUBFIELD } from "../util/constants";
import { GridConfigType } from "../util/Types";

export const Config: GridConfigType[] = [
  {
    fieldName: DETAILSUBFIELD.USER_ID,
    dataType: ValueType.TEXT,
    headerText: "사용자 ID",
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.USER_NAME,
    dataType: ValueType.TEXT,
    headerText: "사용자 이름",
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: "사용 여부",
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.SELECT_YN,
    dataType: ValueType.TEXT,
    headerText: "조회선택 여부",
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.PRINT_YN,
    dataType: ValueType.TEXT,
    headerText: "인쇄 여부",
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.SAVE_YN,
    dataType: ValueType.TEXT,
    headerText: "저장 여부",
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILSUBFIELD.CUSTOM_YN,
    dataType: ValueType.TEXT,
    headerText: "커스텀 여부",
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
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
    fieldName: DETAILSUBFIELD.ROW_STAT,
    dataType: ValueType.TEXT,
    headerText: "",
    width: 60,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
];
