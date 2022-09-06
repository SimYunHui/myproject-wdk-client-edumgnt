import { ValueType } from 'realgrid';

export const Config = [
  {
    fieldName: 'group_sno',
    dataType: ValueType.TEXT,
    headerText: '그룹 일련번호',
    width: 100,
    editable: false,
    visible: false,
  },
  {
    fieldName: 'group_name',
    dataType: ValueType.TEXT,
    headerText: '그룹 명',
    width: 150,
    editable: true,
    styleName: 'TextAlignLeft',
    visible: true,
  },
  {
    fieldName: 'system_type',
    dataType: ValueType.TEXT,
    headerText: '시스템 유형',
    width: 100,
    editable: true,
    visible: true,
  },
  {
    fieldName: 'use_yn',
    dataType: ValueType.TEXT,
    headerText: '사용 여부',
    width: 60,
    editable: true,
    visible: true,
  },
  {
    fieldName: 'remark',
    dataType: ValueType.TEXT,
    headerText: '비고',
    width: 150,
    editable: true,
    styleName: 'TextAlignLeft',
    visible: true,
  },
];
