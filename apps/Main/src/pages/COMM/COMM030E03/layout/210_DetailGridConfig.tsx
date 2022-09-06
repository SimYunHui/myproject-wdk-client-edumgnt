import { ValueType } from 'realgrid';

export const Config = [
  {
    fieldName: 'user_id',
    dataType: ValueType.TEXT,
    headerText: '사용자 ID',
    width: 100,
    editable: false,
    styleName: 'TextAlignLeft',
    visible: true,
  },
  {
    fieldName: 'user_name',
    dataType: ValueType.TEXT,
    headerText: '사용자 명',
    width: 100,
    editable: false,
    visible: true,
  },
  {
    fieldName: 'user_level',
    dataType: ValueType.TEXT,
    headerText: '레벨',
    width: 100,
    editable: false,
    visible: true,
  },
  {
    fieldName: 'remark',
    dataType: ValueType.TEXT,
    headerText: '비고',
    width: 300,
    editable: false,
    styleName: 'TextAlignLeft',
    visible: true,
  },
  {
    fieldName: 'role_no',
    dataType: ValueType.TEXT,
    headerText: 'Role 번호',
    width: 100,
    editable: false,
    styleName: 'TextAlignLeft',
    visible: false,
  },
];
