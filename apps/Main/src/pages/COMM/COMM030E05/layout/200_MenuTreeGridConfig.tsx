import { ValueType } from 'realgrid';
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from '../util/constants';
import { GridConfigType } from '../util/Types';

export const Config: GridConfigType[] = [
  {
    fieldName: FIELD.MENU_NAME,
    dataType: ValueType.TEXT,
    headerText: '메뉴명',
    width: 150,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
  },
  {
    fieldName: FIELD.SYSTEM_TYPE,
    dataType: ValueType.TEXT,
    headerText: '시스템유형',
    width: 50,
    editable: false,
    visible: true,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.MENU_SNO,
    dataType: ValueType.NUMBER,
    headerText: '메뉴 일련번호',
    width: 100,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.RUN_SNO,
    dataType: ValueType.NUMBER,
    headerText: '실행 일련번호',
    width: 100,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.SORT_SEQ,
    dataType: ValueType.NUMBER,
    headerText: '정렬순서',
    width: 50,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: false,
  },
  {
    fieldName: FIELD.MENU_TREE_SNO,
    dataType: ValueType.NUMBER,
    headerText: '트리메뉴 일련번호',
    width: 200,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
  {
    fieldName: FIELD.PARENT_MENU_TREE_SNO,
    dataType: ValueType.NUMBER,
    headerText: '부모 트리메뉴 일련번호',
    width: 200,
    editable: false,
    visible: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
  },
];
