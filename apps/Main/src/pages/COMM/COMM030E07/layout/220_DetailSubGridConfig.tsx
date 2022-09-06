import { ValueType } from 'realgrid';
export const Config = [
  {
    fieldName: 'user_id',
    dataType: ValueType.TEXT,
    headerText: '사용자 ID',
    width: '100',
    editable: true,

    textAlignment: 'center',
    visible: false,
  },
  {
    fieldName: 'run_name',
    dataType: ValueType.TEXT,
    headerText: '실행명',
    width: '150',
    editable: false,
    visible: true,
    styleName: 'TextAlignLeft',
  },
  {
    fieldName: 'menu_sno',
    dataType: ValueType.NUMBER,
    headerText: '메뉴 일련번호',
    width: '100',
    editable: false,
    visible: false,
    textAlignment: 'center',
  },
  {
    fieldName: 'run_sno',
    dataType: ValueType.NUMBER,
    headerText: '실행 일련번호',
    width: '100',
    editable: false,
    visible: false,
    textAlignment: 'center',
  },

  {
    fieldName: 'sort_seq',
    dataType: ValueType.INT,
    headerText: '정렬순서',
    width: '100',
    editable: true,
    visible: true,
    textAlignment: 'center',
  },
  {
    fieldName: 'row_stat',
    dataType: ValueType.TEXT,
    headerText: '',
    width: '60',
    editable: false,

    textAlignment: 'center',
    visible: false,
  },
];
export const fields = [
  {
    fieldName: 'user_id',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'menu_sno',
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: 'run_sno',
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: 'run_name',
    dataType: ValueType.TEXT,
  },
  {
    fieldName: 'sort_seq',
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: 'row_stat',
    dataType: ValueType.TEXT,
  },
];

export const columns = [
  {
    name: 'user_id',
    fieldName: 'user_id',
    type: 'data',
    width: '100',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    editable: false,
    header: {
      text: '사용자 ID',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    visible: false,
  },
  {
    name: 'menu_sno',
    fieldName: 'menu_sno',
    type: 'data',
    width: '100',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    editable: false,
    header: {
      text: '메뉴 일련번호',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'run_sno',
    fieldName: 'run_sno',
    type: 'data',
    width: '100',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    editable: false,
    header: {
      text: '실행 일련번호',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'run_name',
    fieldName: 'run_name',
    type: 'data',
    width: '150',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    editable: false,
    header: {
      text: '실행명',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'sort_seq',
    fieldName: 'sort_seq',
    type: 'data',
    width: '100',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    editable: true,
    header: {
      text: '정렬순서',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'row_stat',
    fieldName: 'row_stat',
    type: 'data',
    width: '150',
    styles: {
      textAlignment: 'center',
      font: 'Nanum Gothic',
    },
    editable: true,
    header: {
      text: '',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    visible: false,
  },
];
