import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { GridFooter, ValidationError, ValidationLevel } from 'realgrid';
import {useConfirm}  from "@vntgcorp/vntg-wdk-client";
import { ESGrid }  from "@vntgcorp/vntg-wdk-client";
import { info }  from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader }  from "@vntgcorp/vntg-wdk-client";
import { FIELD } from '../utils/constants';
import { GridDataType, MasterGridHandler, MasterGridProps } from '../utils/Types';
import { Config } from './200_MasterGridConfig';

let masterGrid: ESGrid;

export const setGridValue = (name: string, value: string | number) => {
  const { dataRow } = masterGrid.getFocusedRowHandle();
  if (dataRow === -1) return;
  masterGrid.setValue(dataRow, name, value);
};

export const getGridValues = () => {
  const gridView = masterGrid.getGridView();
  let saveData: GridDataType[] = [];
  let checkRequired = false;
  gridView.commit(true);

  // 유효성 검사 설정
  gridView.onValidateColumn = function (_grid, column, _inserting, value) {
    let error: ValidationError;
    if (column.name === FIELD.CORP_CODE) {
      if (!value) {
        checkRequired = true;
        error.level = ValidationLevel.ERROR;
        error.message = '필수 입력 사항입니다';
        return error;
      }
    }
    return null;
  };

  // 일괄 유효성 검사
  const getInvalidCells = gridView.validateCells(null);

  if (!getInvalidCells && !checkRequired) {
    saveData = masterGrid.getCudRows();
  }
  // 유효성 검사 초기화
  gridView.onValidateColumn = null;

  return saveData;
};

export const addRow = (data: { foundation_date: string; rep_corp_yn: string; row_stat: string; __rowState: string }) =>
  masterGrid.insertRow(data);
export const setRowValue = (index: number, fieldName: string, value: string | number) => {
  masterGrid.setValue(index, fieldName, value);
};

export const getCurrentDataRow = () => {
  const { dataRow } = masterGrid.getFocusedRowHandle();
  let result = {} as GridDataType;

  if (dataRow == -1) return null;
  result = masterGrid.getJsonRow(dataRow) as GridDataType;
  return result;
};

const MasterGrid = forwardRef<MasterGridHandler, MasterGridProps>(({ originRows, onAddRow, onSelectRow }, ref) => {
  const { isConfirmed } = useConfirm();
  const [rowCnt, setRowCnt] = useState<number>(null);

  useImperativeHandle(ref, () => ({
    cleanup() {
      masterGrid.clearnRow();
      setRowCnt(null);
    },
    changeData(rowIndex: number, fieldName: string, value: string) {
      masterGrid.setValue(rowIndex, fieldName, value);
    },
  }));

  useEffect(() => {
    masterGrid = new ESGrid('mastergrid');
    masterGrid.initializeGrid(Config, originRows);
    // 컬럼 설정
    const gridView = masterGrid.getGridView();
    gridView.setColumns(Config);
    gridView.setFooters({
      get(_index: number): GridFooter {
        return undefined;
      },
      getVisible(_index?: number): GridFooter {
        return undefined;
      },
      visible: false,
    });
    // 그리드 row 선택이벤트
    gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
      if (newRow !== oldRow && newRow !== -1) {
        const curr = masterGrid.getFocusedRowHandle();
        onSelectRow(curr.dataRow, grid.getDataSource().getJsonRow(curr.dataRow, true));
      }
    };

    masterGrid.setBoolColumn(FIELD.REP_CORP_YN);
    // masterGrid.setEvenFillStyle();

    // gridView.onCurrentChanging = (grid, oldIndex, newIndex) => {
    //   const detailData = getDetailGridValues();
    //   //console.log('detailData', detailData);
    //
    //   if (detailData.length > 0) {
    //     if (!confirm('변경된 내용이 존재합니다. 새로운 데이터를 조회하시겠습니까?')) {
    //       return false;
    //     }
    //   }
    // };

    masterGrid.onEditCommit((grid, index, _oldValue, _newValue) => {
      console.log('onEditCommit', grid, index);

      return true;
    });

    return () => masterGrid.destroy();
  }, []);

  useEffect(() => {
    masterGrid.setRows(originRows);
    masterGrid.setFirstRowFocused(true);
    setRowCnt(originRows.length);
  }, [originRows]);

  // 공통버튼 이벤트
  const addRow = () => {
    onAddRow();
  };

  const minusRow = async () => {
    const curr = masterGrid.getGridView().getCurrent();
    if (curr.dataRow !== -1) {
      const { result } = await isConfirmed('행 삭제 확인', '해당 행을 삭제 하시겠습니까?', false);
      if (result) {
        masterGrid.getGridView().cancel();
        masterGrid.deleteRow();
      }
    } else {
      info('삭제할 행을 선택해주세요');
    }
  };

  const refresh = () => {
    masterGrid.reflashRow(originRows);
  };

  const gridBtnEvent = (type: any) => {
    switch (type) {
      case GridHdBtnType.plus:
        addRow();
        break;
      case GridHdBtnType.minus:
        minusRow();
        break;
      case GridHdBtnType.reflash:
        refresh();
        break;
      case GridHdBtnType.right:
        break;
      case GridHdBtnType.left:
        break;
      case GridHdBtnType.leftshift:
        break;
      case GridHdBtnType.rightshift:
      default:
        break;
    }
  };

  return (
    <div className="grid">
      <GridHeader title={'법인 목록'} type="default" gridBtnEvent={gridBtnEvent} rowCnt={rowCnt} />
      <div className="realGrid" id="mastergrid" />
    </div>
  );
});
export default React.memo(MasterGrid);
