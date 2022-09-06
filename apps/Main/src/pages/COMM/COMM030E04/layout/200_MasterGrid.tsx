import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CellIndex, GridBase } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./200_MasterGridConfig";
import { MasterGridRowDataType } from "./Types";

type MasterGridProps = {
  title: string;
  originRows: MasterGridRowDataType[];
  onSelectRow?: any;
  onRowState?: () => number;
  cleanupOther?: () => void;
  ref?: React.ReactNode;
};

let masterGrid: ESGrid;
const MasterGrid: React.FC<MasterGridProps> = forwardRef(
  ({ title, originRows, onSelectRow, onRowState, cleanupOther }, ref) => {
    const gridRef = useRef(null);
    const { isConfirmed } = useConfirm();
    const [rowCnt, setRowCnt] = useState<number>(null);

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = masterGrid.getCudRows();
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
      masterGrid.setLookup("user_level", "AA03");
      masterGrid.setBoolColumn("use_yn");
      const gridControlOptions = {
        editable: false,
        updatable: false,
        insertable: false,
        appendable: false,
        deletable: false,
        softDeleting: false,
      };
      masterGrid.setGridOptions(gridControlOptions);
      masterGrid.orderBy(["user_id"], ["ascending"]);
      // 그리드 Cell 선택 시 Event
      masterGrid.onCellClicked(onCellClick);
      // 그리드 Row Focus 변경 시 Event
      masterGrid.onCurrentRowChanged(onChangeRow);

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
    const onCellClick = (object: { dataRow: number[] }) => {
      if (object.dataRow !== undefined) {
        if (!masterGrid.isCheckedRow(object.dataRow)) {
          masterGrid.onCheckRows(object.dataRow, true);
        } else masterGrid.onCheckRows(object.dataRow, false);
      }
    };

    /**
     * 그리드 Row Focus 변경 시 Event
     * @param object
     */
    const onChangeRow = (object: { value: any }) => {
      onSelectRow(object.value);
    };

    return (
      <div className="grid">
        <GridHeader title={title} rowCnt={rowCnt} />
        <div className="realGrid" id="mastergrid" ref={gridRef}></div>
      </div>
    );
  }
);
export default MasterGrid;
