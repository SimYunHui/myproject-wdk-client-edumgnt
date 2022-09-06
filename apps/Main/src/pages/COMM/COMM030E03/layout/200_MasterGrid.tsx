import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CellIndex, GridBase, SortCase, SortDirection } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./200_MasterGridConfig";
import { MasterGridRowDataType } from "./Types";

type MasterGridProps = {
  title: string;
  originRows: MasterGridRowDataType[];
  onSelectRow?: any;
  cleanupOther?: () => void;
  onRowState?: () => number;
  ref?: React.ReactNode;
};

let masterGrid: ESGrid;
const MasterGrid: React.FC<MasterGridProps> = forwardRef(
  ({ title, originRows, onSelectRow, cleanupOther, onRowState }, ref) => {
    const { isConfirmed } = useConfirm();
    const gridRef = useRef(null);
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
      masterGrid.setBoolColumn("system_yn");
      masterGrid.setBoolColumn("use_yn");
      masterGrid.setLookup("role_type", "AA14");
      masterGrid.setEvenFillStyle();
      masterGrid
        .getGridView()
        .orderBy(
          ["role_no"],
          [SortDirection.ASCENDING],
          [SortCase.INSENSITIVE]
        );

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

    /**
     * 공통버튼 이벤트
     */
    const addRow = () => {
      const tempParamObj = {
        role_no: 0,
        role_name: "",
        remark: "",
        system_yn: "N",
        use_yn: "Y",
      };
      masterGrid.insertRow(tempParamObj);
      cleanupOther();
    };

    const minusRow = async () => {
      const curr = masterGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          masterGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    const reflashRow = () => {
      masterGrid.reflashRow(originRows);
      onSelectRow([]);
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
