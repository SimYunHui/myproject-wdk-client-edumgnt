import { ValueType } from 'realgrid';
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { DETAILFIELD } from './constants';
import { GridConfigType } from './Types';

export const Config: GridConfigType[] = [
  {
    fieldName: DETAILFIELD.PGM_ID,
    dataType: ValueType.TEXT,
    headerText: '프로그램 ID',
    width: 100,
    editable: true,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.PGM_NAME,
    dataType: ValueType.TEXT,
    headerText: '프로그램명',
    width: 200,
    editable: true,

    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: DETAILFIELD.PGM_TYPE,
    dataType: ValueType.TEXT,
    headerText: '프로그램유형',
    width: 150,
    editable: true,

    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: DETAILFIELD.PGM_URL,
    dataType: ValueType.TEXT,
    headerText: '프로그램URL',
    width: 170,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: DETAILFIELD.USE_YN,
    dataType: ValueType.TEXT,
    headerText: '사용여부',
    width: 70,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
];
