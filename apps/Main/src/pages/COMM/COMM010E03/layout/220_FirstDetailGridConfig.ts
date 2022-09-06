import { ValueType } from 'realgrid';
import { FIRSTDETAILFIELD } from './constants';
import { GRIDSTYLETYPE } from "@vntgcorp/vntg-wdk-client";
export const Config = [
  {
    fieldName: FIRSTDETAILFIELD.USER_ID,
    dataType: ValueType.TEXT,
    header: {
      text: '사용자 ID',
    },
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: false,
    readonly: true,
  },
  {
    fieldName: 'group_sno',
    dataType: ValueType.TEXT,
    header: {
      text: '그룹 일련번호',
    },
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: false,
    readonly: true,
  },
  {
    fieldName: 'group_name',
    dataType: ValueType.TEXT,
    header: {
      text: '그룹 명',
    },
    width: 150,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
    readonly: true,
  },
  {
    fieldName: 'system_type',
    dataType: ValueType.TEXT,
    header: {
      text: '시스템 유형',
    },
    width: 100,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
    readonly: true,
  },
  {
    fieldName: 'use_yn',
    dataType: ValueType.TEXT,
    header: {
      text: '사용 여부',
    },
    width: 70,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTCENTER,
    visible: true,
    readonly: true,
  },
  {
    fieldName: 'remark',
    dataType: ValueType.TEXT,
    header: {
      text: '비고',
    },
    width: 150,
    editable: false,
    styleName: GRIDSTYLETYPE.TEXTLEFT,
    visible: true,
    readonly: true,
  },
];
