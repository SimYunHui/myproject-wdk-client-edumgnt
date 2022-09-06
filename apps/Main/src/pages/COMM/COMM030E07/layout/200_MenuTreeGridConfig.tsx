import { ValueType } from 'realgrid';

export const Config = [
  {
    fieldName: 'icon',
    dataType: ValueType.NUMBER,
    visible: false,
  },
  {
    fieldName: 'menu_name',
    dataType: ValueType.TEXT,
    headerText: '메뉴명',
    width: '200',
    editable: false,

    textAlignment: 'center',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    visible: true,
  },
  {
    fieldName: 'system_type',
    dataType: ValueType.TEXT,
    headerText: '시스템유형',
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    width: '50',
    editable: false,
    textAlignment: 'center',
    visible: false,
  },
  {
    fieldName: 'menu_sno',
    dataType: ValueType.NUMBER,
    headerText: '메뉴 일련번호',
    width: '100',
    editable: false,
    textReadOnly: true,
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    header: {
      text: '메뉴 일련번호',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    visible: false,
  },
  {
    fieldName: 'run_sno',
    dataType: ValueType.NUMBER,
    headerText: '실행 일련번호',
    width: '100',
    editable: false,

    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    header: {
      text: '실행 일련번호',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    visible: false,
  },

  {
    fieldName: 'sort_seq',
    dataType: ValueType.NUMBER,
    headerText: '정렬순서',
    width: '50',
    editable: false,
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    visible: false,
  },
  {
    fieldName: 'menu_tree_sno',
    dataType: ValueType.NUMBER,
    headerText: ' 트리메뉴 일련번호',
    width: '200',
    editable: false,
    visible: false,
    textAlignment: 'center',
  },
  {
    fieldName: 'parent_menu_sno',
    dataType: ValueType.NUMBER,
    headerText: '부모 트리메뉴 일련번호',
    width: '200',
    editable: false,
    visible: false,
    textAlignment: 'center',
  },
];
