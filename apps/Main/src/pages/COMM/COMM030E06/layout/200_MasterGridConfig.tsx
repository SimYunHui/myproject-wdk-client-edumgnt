import { ValueType } from 'realgrid';

export const Config = [
  {
    fieldName: 'group_sno',
    dataType: ValueType.TEXT,
    headerText: '그룹 일련번호',
    width: 100,
    editable: false,
    textAlignment: 'center',
    visible: false,
  },
  {
    fieldName: 'group_name',
    dataType: ValueType.TEXT,
    headerText: '그룹명',
    width: 150,
    editable: false,
    styleName: 'TextAlignLeft',
    visible: true,
  },
  {
    fieldName: 'system_type',
    dataType: ValueType.TEXT,
    headerText: '시스템 유형',
    width: 100,
    editable: true,
    textAlignment: 'center',
    visible: false,
  },
  {
    fieldName: 'use_yn',
    dataType: ValueType.TEXT,
    headerText: '사용 여부',
    width: 60,
    editable: true,
    textAlignment: 'center',
    visible: false,
  },
  {
    fieldName: 'remark',
    dataType: ValueType.TEXT,
    headerText: '그룹 설명',
    width: 150,
    editable: false,
    styleName: 'TextAlignLeft',
    visible: true,
  },
];
