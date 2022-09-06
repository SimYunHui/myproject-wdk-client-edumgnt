import { ValueType } from 'realgrid';
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { DETAILFIELD } from '../util/constants';
import { GridConfigType } from '../util/Types';

export const Config: GridConfigType[] = [
  {
    fieldName: DETAILFIELD.GROUP_SNO,
    dataType: ValueType.NUMBER,
    headerText: '그룹 일련번호',
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
  {
    fieldName: DETAILFIELD.GROUP_NAME,
    dataType: ValueType.TEXT,
    headerText: '그룹 이름',
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.RUN_SNO,
    dataType: ValueType.NUMBER,
    headerText: '실행 일련번호',
    width: 100,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: '사용 여부',
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.SELECT_YN,
    dataType: ValueType.TEXT,
    headerText: '조회선택 여부',
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.PRINT_YN,
    dataType: ValueType.TEXT,
    headerText: '인쇄 여부',
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.SAVE_YN,
    dataType: ValueType.TEXT,
    headerText: '저장 여부',
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },
  {
    fieldName: DETAILFIELD.CUSTOM_YN,
    dataType: ValueType.TEXT,
    headerText: '커스텀 여부',
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
  },

  {
    fieldName: DETAILFIELD.ROW_STAT,
    dataType: ValueType.TEXT,
    headerText: '',
    width: 60,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
];
