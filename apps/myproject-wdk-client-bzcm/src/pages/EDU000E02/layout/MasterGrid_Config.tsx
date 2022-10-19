import { SFType } from '@vntgcorp/vntg-wdk-client';
import { ValueType } from 'realgrid';

// 마스터 그리드의 컬럼을 기술한다.
// 아래 5개 컬럼은 필수값 (백엔드에서 필요, 모든 테이블에 extend 되어 있음)
// first_rg_yms, first_rg_idf, last_update_yms, last_update_idf, row_stat

export const GridConfig = [
  {
    fieldName: 'emp_no',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '사번',
    width: 80,
  },
  {
    fieldName: 'emp_name',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '성명',
    width: 80,
  },
  {
    fieldName: 'user_id',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: 'ID',
    width: 100,
  },
  {
    fieldName: 'dept_code',
    dataType: ValueType.TEXT,
    visible: false,
    headerText: '부서코드',
    width: 80,
  },
  {
    fieldName: 'dept_name',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '부서명',
    width: 80,
  },
  {
    fieldName: 'job',
    dataType: ValueType.TEXT,
    visible: false,
    headerText: '직무',
  },
  {
    fieldName: 'job_name',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '직무명',
    width: 80,
  },
  {
    fieldName: 'responsi',
    dataType: ValueType.TEXT,
    visible: false,
    headerText: '직책',
  },
  {
    fieldName: 'responsi_name',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '직책명',
    width: 100,
  },
  {
    fieldName: 'phon_number',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '전화번호',
    width: 120,
  },
  {
    fieldName: 'email',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '이메일',
    width: 180,
  },
  {
    fieldName: 'use_yn',
    dataType: ValueType.TEXT,
    visible: true,
    headerText: '사용여부',
    width: 60,
  },
  {
    fieldName: 'first_rg_yms',
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: 'first_rg_idf',
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: 'last_update_yms',
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: 'last_update_idf',
    dataType: ValueType.TEXT,
    visible: false,
  },
  {
    fieldName: 'row_stat',
    dataType: ValueType.TEXT,
    visible: false,
  },
];
