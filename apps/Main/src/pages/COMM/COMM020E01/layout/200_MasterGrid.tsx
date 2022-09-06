import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  CellIndex,
  GridBase,
  ValidationError,
  ValidationLevel,
} from "realgrid";

import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "../util/constants";
import { MasterGridProps, RowDataType } from "../util/Types";
import { Config } from "./200_MasterGridConfig";
import { IClickData } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESGrid";

let masterGrid: ESGrid;
// let onCurrentChanging = undefined;

export const getGridValues = () => {
  const gridView = masterGrid.getGridView();
  let saveData: RowDataType[] = [];
  let checkRequired = false;
  gridView.commit(true);

  // 유효성 검사 설정
  gridView.onValidateColumn = function (_grid, column, _inserting, value) {
    const error: ValidationError = {
      message: "",
      level: ValidationLevel.IGNORE,
    };

    if (
      column.name === FIELD.CM_CODE_TYPE_ID ||
      column.name === FIELD.CM_CODE_TYPE_NAME ||
      column.name === FIELD.SYSTEM_YN
    ) {
      if (!value) {
        checkRequired = true;
        error.level = ValidationLevel.ERROR;
        error.message = "필수 입력 사항입니다.";
        return error;
      }
    }
    return null;
  };

  // 일괄 유효성 검사
  const getInvalidCells = gridView.validateCells(null);

  if (!getInvalidCells && !checkRequired) {
    saveData = masterGrid.getCudRows();
    saveData = saveData.map((item: RowDataType) => {
      for (const [key, value] of Object.entries(item)) {
        type ObjectKey = keyof typeof item;

        if (value === undefined) {
          //@ts-ignore
          item[key as ObjectKey] = null;
        }
      }

      return item;
    });
  }

  // 유효성 검사 초기화
  gridView.onValidateColumn = null;

  return saveData;
};

const MasterGrid: React.FC<MasterGridProps> = forwardRef(
  (
    { title, originRows, onSelectRow, setIsChanged, cleanupOther, onRowState },
    ref
  ) => {
    const gridRef = useRef(null);
    const { isConfirmed } = useConfirm();
    const [rowCnt, setRowCnt] = useState<number>(null);

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = masterGrid.checkGridData();
        return updatedRows;
      },
      cleanup() {
        masterGrid.clearnRow();
        setRowCnt(null);
      },
    }));

    useEffect(() => {
      masterGrid = new ESGrid("mastergrid");
      masterGrid.initializeGrid(Config, originRows);
      masterGrid.setNumberEditor([FIELD.CM_CODE_LENGTH]);
      masterGrid.setLookup(FIELD.SYSTEM_YN, "CM28");
      masterGrid.setBoolColumn(FIELD.DELETE_YN);
      // 그리드 정렬
      masterGrid.orderBy([FIELD.CM_CODE_TYPE_ID], ["ascending"]);
      // 특정 컬럼 추가된 행만 수정 가능
      masterGrid.setColumnStyleCallback(FIELD.CM_CODE_TYPE_ID, setEditable);
      masterGrid.setColumnStyleCallback(FIELD.SYSTEM_YN, setEditable);
      // 그리드 Cell 선택 시 Event
      // masterGrid.onCellClicked(onCellClick);
      masterGrid.getGridView().onCellClicked = function (
        _grid,
        clickData: IClickData
      ) {
        const row = clickData["dataRow"];

        if (typeof row != "number") return;
        if (row > -1) {
          // const rowInfo = grid.getCurrent();
          // const rowVal = grid.getDataSource().getJsonRow(rowInfo.dataRow, true);
          // console.log('Selected Row Data is  : ', [rowVal]);
        }
      };
      // 그리드 Row Focus 변경 시 Event
      masterGrid.onCurrentRowChanged((row) => {
        onSelectRow(row.value);
      });
      // 그리드 컬럼 필수값 체크
      masterGrid.setIsNotEmptyColumn([
        FIELD.CM_CODE_TYPE_ID,
        FIELD.CM_CODE_TYPE_NAME,
        FIELD.SYSTEM_YN,
      ]);

      masterGrid.getGridView().onEditChange = function (_grid, _index, _value) {
        setIsChanged(true);
      };

      masterGrid.onCellEdited((grid, _itemIndex, row, _field) => {
        console.log("onCellEdited");
        if (!grid.validateCells(null, true)) {
          grid.commit(true);
          onSelectRow(grid.getDataSource().getJsonRow(row, true));
          setIsChanged(true);
        } else {
          grid.commit(false);
        }
      });

      const gridView = masterGrid.getGridView();
      gridView.onCurrentChanging = function (
        _grid: GridBase,
        oldIndex: CellIndex,
        newIndex: CellIndex
      ) {
        const ret = onRowState();

        if (oldIndex.dataRow === -1) return null;
        if (newIndex.dataRow > -1) {
          if (oldIndex.dataRow !== newIndex.dataRow) {
            if (ret) {
              isConfirmed(
                "저장 확인",
                `'예'를 선택하면 생성된 자료가 삭제됩니다.\n계속 하시겠습니까?`,
                false
              ).then(({ result }) => {
                if (result == false) {
                  return false;
                } else {
                  cleanupOther();
                  this.setCurrent(newIndex);
                  return true;
                }
              });
            } else {
              return true;
            }
          } else if (oldIndex.dataRow == newIndex.dataRow) {
            return true;
          }

          return false;
        }
      };

      return () => {
        masterGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (originRows) {
        masterGrid.setRows(originRows);
        masterGrid.setFirstRowFocused(true);
        setRowCnt(originRows.length);
      }
    }, [originRows]);

    /**
     * 특정 컬럼 추가된 행만 수정 가능
     * @param _grid
     * @param dataCell
     * @returns
     */
    const setEditable = function (
      _grid: any,
      dataCell: { index: { dataRow: number } }
    ) {
      const rowState = masterGrid
        .getDataProvier()
        .getRowState(dataCell.index.dataRow);

      const ret = { editable: false };
      if (rowState == "created") {
        ret.editable = true;
      }
      return ret;
    };

    /**
     * 공통버튼 이벤트
     */
    const addRow = () => {
      const tempParamObj = {
        system_yn: "N",
        delete_yn: "N",
      };
      masterGrid.insertWithValidation(tempParamObj);
      cleanupOther();
      setIsChanged(true);
    };

    const minusRow = () => {
      isConfirmed("행 삭제 확인", "해당 행을 삭제 하시겠습니까?", false).then(
        (result) => {
          masterGrid.getGridView().cancel();

          if (result.result) {
            masterGrid.deleteRow();
            setIsChanged(true);
          }
        }
      );
    };

    const reflashRow = () => {
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
          reflashRow();
          break;

        case GridHdBtnType.leftshift:
          break;
        default:
          break;
      }
    };

    return (
      <div className="grid">
        <GridHeader
          title={title}
          type="default"
          gridBtnEvent={gridBtnEvent}
          rowCnt={rowCnt}
        />
        <div className="realGrid" id="mastergrid" ref={gridRef}></div>
      </div>
    );
  }
);
export default MasterGrid;
