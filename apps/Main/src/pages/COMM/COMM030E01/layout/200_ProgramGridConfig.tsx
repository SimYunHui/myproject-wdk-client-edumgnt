import { ValueType } from 'realgrid';
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from './constants';
import { GridConfigType } from './Types';

export const Config: GridConfigType[] = [
  {
    fieldName: FIELD.SYSTEM_CODE,
    dataType: ValueType.TEXT,
    headerText: '시스템코드',
    width: 150,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.SYSTEM_GROUP_CODE,
    dataType: ValueType.TEXT,
    headerText: '시스템 그룹코드',
    width: 150,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.URL,
    dataType: ValueType.TEXT,
    headerText: '상위 URL',
    width: 150,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: FIELD.SYSTEM_GROUP_NAME,
    dataType: ValueType.TEXT,
    headerText: '시스템 그룹명',
    width: 200,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: FIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: '사용여부',
    width: 60,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.REMARK,
    dataType: ValueType.TEXT,
    headerText: '비고',
    width: 60,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
];
