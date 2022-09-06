import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CellIndex, GridBase, SortCase, SortDirection } from "realgrid";
import { Config } from "./200_MasterGridConfig";
import {
  ESGrid,
  GridHdBtnType,
  GridHeader,
  info,
  warning,
  useConfirm,
} from "@vntgcorp/vntg-wdk-client";
import { MasterGridRowDataType } from "./Types";

type MasterGridProps = {
  title: string;
  originRows: MasterGridRowDataType[];
  onSelectRow?: (data: MasterGridRowDataType) => void;
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
        if (!masterGrid.validateCells(null, true)) {
          try {
            const updatedRows = masterGrid.getCudRows();
            return updatedRows;
          } catch (error) {
            masterGrid.getGridView().cancel();
            warning("행 편집을 완료해주세요");
            return [];
          }
        } else {
          warning('"사용자 목록" 유효성검사 오류');
          return [];
        }
      },
      cleanup() {
        masterGrid.clearnRow();
        setRowCnt(null);
      },
    }));

    useEffect(() => {
      masterGrid = new ESGrid("mastergrid");
      masterGrid.initializeGrid(Config, originRows);
      masterGrid.setLookup("system_type", "AA02");
      masterGrid.setLookup("user_level", "AA03");
      masterGrid.setBoolColumn("use_yn");
      // 그리드 Row Focus 변경 시 Event
      masterGrid.onCurrentRowChanged((row: { [x: string]: any }) => {
        onSelectRow(row.value);
      });
      // 특정 컬럼 추가된 행만 수정 가능
      masterGrid.setColumnStyleCallback("user_id", setEditable);

      masterGrid
        .getGridView()
        .orderBy(
          ["user_id"],
          [SortDirection.ASCENDING],
          [SortCase.INSENSITIVE]
        );
      masterGrid.setIsNotEmptyColumn(["user_id", "user_name", "system_type"]);
      // masterGrid.getGridView().editOptions.validateOnEdited = true;

      masterGrid.onCellEdited((grid, row) => {
        // grid.commit(true);
        if (!grid.validateCells(null, true)) {
          grid.commit(true);
          onSelectRow(grid.getDataSource().getJsonRow(row, true));
        } else {
          try {
            grid.commit(false);
          } catch (error) {
            // builderror : Empty block statement
          }
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

      masterGrid.onValidationFail(() => {
        return null;
      });

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
     * 특정 컬럼 추가된 행만 수정 가능
     * @param grid
     * @param dataCell
     * @returns
     */
    const setEditable = function (
      _grid: GridBase,
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
        use_yn: "Y",
        remark: "",
        emp_no: "",
        tel_no: "",
        user_level: "9",
        email: "",
      };
      masterGrid.insertWithValidation(tempParamObj);
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
      onSelectRow({ user_id: undefined });
    };

    const gridBtnEvent = (type: string) => {
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
