/**
 *  메뉴 권한 등록 개인 메뉴 리스트 등록
 * By Pang
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { CellIndex, GridBase } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./200_MasterGridConfig";

/**
 *
 * @param {*} title
 * @param {*} originRows
 * @function saveData

 * @param ref
 */
type DetailGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;
  relationFields?: any;
  addGroupData?: any;
  onRowState?: () => number;
  cleanupOther?: () => void;
  ref?: any;
};

export type GridRefHandle = {
  cleanup: () => void;
  toSave: () => any[];
};

let masterGrid: ESGrid;

const MasterGrid: React.FC<DetailGridProps> = forwardRef<
  GridRefHandle,
  DetailGridProps
>(({ title, originRows, onSelectRow, onRowState, cleanupOther }, ref) => {
  // programList = menu_sno.
  const { isConfirmed } = useConfirm();
  const [rowCnt, setRowCnt] = useState<number>(null);

  useImperativeHandle(ref, () => ({
    toSave() {
      const updatedRows = masterGrid.checkGridData();
      if (updatedRows) {
        return updatedRows;
      }
    },

    cleanup() {
      masterGrid.clearnRow();
      setRowCnt(null);
    },
  }));

  useEffect(() => {
    masterGrid = new ESGrid("masterGrid");
    masterGrid.initializeGrid(Config, originRows);
    masterGrid.setBoolColumn("use_yn");
    masterGrid.setEvenFillStyle();
    // 그리드 Cell 선택 시 Event
    masterGrid.onCellClicked(onCellClick);
    // 그리드 Row Focus 변경 시 Event
    masterGrid.onCurrentRowChanged((row) => {
      onSelectRow(row.value);
    });

    masterGrid.onCurrentChanging((oldIndex, newIndex) => {
      const ret = onRowState();
      if (oldIndex.dataRow !== newIndex.dataRow) {
        if (ret) {
          if (
            !confirm(
              "변경된 내용이 존재합니다. 새로운 데이터를 조회하시겠습니까?"
            )
          ) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return true;
      }
    });

    //행 변경 시, Confirm
    masterGrid.getGridView().onCurrentChanging = function (
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
    masterGrid.setRows(originRows);
    masterGrid.setFirstRowFocused(true);
    setRowCnt(originRows.length);
  }, [originRows]);
  /**
   * 그리드 Cell 선택 시 Event
   * @param object
   */
  const onCellClick = (object: any) => {
    if (object.dataRow !== undefined) {
      if (!masterGrid.isCheckedRow(object.dataRow)) {
        masterGrid.onCheckRows(object.dataRow, true);
      } else masterGrid.onCheckRows(object.dataRow, false);
    }
  };

  return (
    <div className="grid">
      <GridHeader title={title} rowCnt={rowCnt} />
      <div className="realGrid" id="masterGrid"></div>
    </div>
  );
});
export default MasterGrid;
