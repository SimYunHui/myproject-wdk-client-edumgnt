import { ValueType } from 'realgrid';
import { GRIDSTYLETYPE }  from "@vntgcorp/vntg-wdk-client";
import { FIELD } from '../util/constants';
import { GridConfigType } from '../util/Types';

export const Config: GridConfigType[] = [
  {
    fieldName: FIELD.USER_ID,
    dataType: ValueType.TEXT,
    headerText: '아이디',
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: FIELD.USER_NAME,
    dataType: ValueType.TEXT,
    headerText: '사용자명',
    width: 100,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
  },
  {
    fieldName: FIELD.BUSI_PLACE,
    dataType: ValueType.TEXT,
    headerText: '사업장',
    width: 70,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.DEPT_NO,
    dataType: ValueType.TEXT,
    headerText: '부서/공장',
    width: 200,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
];
