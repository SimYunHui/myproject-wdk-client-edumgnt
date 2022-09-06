import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { dateToStr } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import {useConfirm} from  "@vntgcorp/vntg-wdk-client";
import { warning } from "@vntgcorp/vntg-wdk-client";
import { Config } from './210_DetailGridConfig';
import { ValidationError, ValidationLevel } from 'realgrid';
import { DETAILFIELD } from '../util/constants';
import { DetailGridProps } from '../util/Types';

let detailGrid: ESGrid;

export const getDetailGridValues = () => {
  const gridView = detailGrid.getGridView();
  let saveData = [];
  let checkRequired = false;
  gridView.commit(true);

  // 유효성 검사 설정
  gridView.onValidateColumn = function (_grid, column, _inserting, value) {
    const error: ValidationError = { message: '', level: ValidationLevel.IGNORE };

    if (column.name === DETAILFIELD.DETAIL_CODE_ID || column.name === DETAILFIELD.DETAIL_CODE_NAME) {
      if (!value) {
        checkRequired = true;
        error.level = ValidationLevel.ERROR;
        error.message = '필수 입력 사항입니다.';
        return error;
      }
    }
    return null;
  };

  // 일괄 유효성 검사
  const getInvalidCells = gridView.validateCells(null);

  if (!getInvalidCells && !checkRequired) {
    saveData = detailGrid.getCudRows();
    saveData = saveData.map((item) => {
      for (const key in item) {
        if (item[key] === undefined) {
          item[key] = null;
        }
      }
      return item;
    });

    if (saveData.length !== 0) {
      saveData = saveData.map((updaterow) => {
        return {
          ...updaterow,
          valid_start_date: dateToStr(updaterow.valid_start_date),
          valid_end_date: dateToStr(updaterow.valid_end_date),
        };
      });
      return saveData;
    }
  }
  // 유효성 검사 초기화
  gridView.onValidateColumn = null;

  return saveData;
};

const DetailGrid: React.FC<DetailGridProps> = forwardRef(({ title, originRows, relationFields, setIsChanged }, ref) => {
  const detailgridRef = useRef(null);
  const { isConfirmed } = useConfirm();

  useImperativeHandle(ref, () => ({
    toSave() {
      const updatedRows = detailGrid.getCudRows();
      return updatedRows;
    },
    cleanup() {
      detailGrid.clearnRow();
    },

    //디테일 변경내용 확인
    changeData() {
      const rowCnt = detailGrid.getRowStateCount('*');
      return rowCnt;
    },
  }));

  useEffect(() => {
    detailGrid = new ESGrid('detailgrid');

    return () => {
      detailGrid.destroy();
    };
  }, []);

  useEffect(() => {
    if (detailGrid) {
      detailGrid.initializeGrid(Config, originRows);
      detailGrid.setNumberEditor([DETAILFIELD.SORT_SEQ]);
      detailGrid.setBoolColumn(DETAILFIELD.USE_YN);
      detailGrid.setDateColumn(DETAILFIELD.VALID_START_DATE);
      detailGrid.setDateColumn(DETAILFIELD.VALID_END_DATE);
      // 특정 컬럼 추가된 행만 수정 가능
      detailGrid.setColumnStyleCallback(DETAILFIELD.DETAIL_CODE_ID, setEditable);
      // 그리드 Cell 선택 시 Event
      detailGrid.getGridView().onCellClicked = function (grid, clickData: { [x: string]: string }) {
        const row = clickData['dataRow'];

        if (typeof row != 'number') return;
        if (row > -1) {
          const rowInfo = grid.getCurrent();
          // const rowVal = grid.getDataSource().getJsonRow(rowInfo.dataRow, true);
          // console.log('Selected Row Data is  : ', [rowVal]);
        }
      };

      detailGrid.getGridView().onEditChange = function () {
        setIsChanged(true);
      };

      detailGrid.onCellEdited((grid) => {
        if (!grid.validateCells(null, true)) {
          grid.commit(true);
          setIsChanged(true);
        } else {
          grid.commit(false);
        }
      });
    }
  }, [detailGrid]);

  useEffect(() => {
    detailGrid.setRows(originRows);
  }, [originRows]);

  /**
   * 특정 컬럼 추가된 행만 수정 가능
   * @param _grid
   * @param dataCell
   * @returns
   */
  const setEditable = function (_grid: any, dataCell: { index: { dataRow: number } }) {
    const rowState = detailGrid.getDataProvier().getRowState(dataCell.index.dataRow);

    const ret = { editable: false };
    if (rowState == 'created') {
      ret.editable = true;
    }
    return ret;
  };

  /**
   * 공통버튼 이벤트
   */
  const addRow = () => {
    const today = new Date();
    const tempParamObj = {
      cm_code_type_id: relationFields,
      use_yn: 'Y',
      valid_start_date: today,
      valid_end_date: '9999-12-31',
    };
    if (relationFields !== undefined && relationFields.length !== 0) {
      detailGrid.insertWithValidation(tempParamObj);
      setIsChanged(true);
    } else {
      warning('[공통 코드 기본 목록] 편집을 완료하세요');
    }
  };

  const minusRow = () => {
    isConfirmed('행 삭제 확인', '해당 행을 삭제 하시겠습니까?', false).then((result) => {
      detailGrid.getGridView().cancel();

      if (result.result) {
        detailGrid.deleteRow();
        setIsChanged(true);
      }
    });
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
        break;

      case GridHdBtnType.leftshift:
        break;
      default:
        break;
    }
  };
  return (
    <div className="grid">
      <GridHeader title={title} type="default" gridBtnEvent={gridBtnEvent} />
      <div className="realGrid" id="detailgrid" ref={detailgridRef}></div>
    </div>
  );
});
export default DetailGrid;
