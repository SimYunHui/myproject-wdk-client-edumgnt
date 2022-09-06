/**
 * 개인 메뉴 등록 개인 메뉴 리스트 등록
 * By Pang
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
// import ESTreeGrid from '../../../common/utils/ESGrid/ESTreeGrid';
import { getUniqueValue } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./210_DetailGridConfig";
import { useRecoilValue } from "recoil";
import { userInfoGlobalState } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";
import {
  CellIndex,
  GridBase,
  RowObject,
  SortDirection,
  SummaryType,
} from "realgrid";
import { DetailGridRowDataType } from "./Types";
import ESTreeGrid from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";

/**
 *
 * @param {*} title
 * @param {*} originRows
 * @function saveData

 * @param ref
 */
type DetailGridProps = {
  title: string;
  originRows: DetailGridRowDataType[];
  onSelectRow?: (data: any) => void;
  onRowState?: () => number;
  cleanupOther?: () => void;
  ref?: React.ReactNode;
};
let treeGrid: ESTreeGrid;
const DetailGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows, onSelectRow, onRowState, cleanupOther }, ref) => {
    const { isConfirmed } = useConfirm();
    const [parentID, setParentID] = useState(0);
    const userInfo = useRecoilValue(userInfoGlobalState);

    useImperativeHandle(ref, () => ({
      setRowData(data: any) {
        if (data) {
          treeGrid.clearRow();
          treeGrid
            .getTreeProvider()
            .setObjectRows({ rows: data }, "rows", "", "icon");
          treeGrid.getTreeView().expand(0);
        } else {
          treeGrid.clearRow();
        }
      },
      toSave() {
        treeGrid.getTreeView().commit();
        const updatedRows = treeGrid.CheckGridData();
        return updatedRows;
      },

      cleanup() {
        treeGrid.clearRow();
      },
    }));

    useEffect(() => {
      treeGrid = new ESTreeGrid("treeUserGrid");
      treeGrid.initializeGrid(Config, originRows);
      treeGrid.getTreeView().sortingOptions.enabled = false;
      treeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);
      // 그리드 Cell 선택 시 Event
      treeGrid.onCellClicked(onCellClick);
      // 그리드 Row Focus 변경 시 Event
      treeGrid.onCurrentRowChanged((row: RowObject) => {
        onSelectRow(row);
        if (row) {
          setParentID(row.menu_sno);
        }
      });

      //행 변경 시, Confirm
      treeGrid.getTreeView().onCurrentChanging = function (
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
      treeGrid.onCellEdited((grid, _itemIndex, _row, _field) => {
        if (!grid.validateCells(null, true)) {
          grid.commit(true);
        } else {
          try {
            grid.commit(false);
          } catch (error) {
            // builderror : Empty block statement
          }
        }
      });
      return () => {
        treeGrid.destroy();
      };
    }, []);
    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: { dataRow: number[] }) => {
      if (object.dataRow !== undefined) {
        if (!treeGrid.isCheckedRow(object.dataRow)) {
          treeGrid.onCheckRows(object.dataRow, true);
        } else treeGrid.onCheckRows(object.dataRow, false);
      }
    };
    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    const addRow = () => {
      //현재 최대 seq 가져오기.
      let maxRowSeq: number;

      if (treeGrid.getTreeView().getItemCount() === 0) {
        maxRowSeq = 0;
      } else {
        maxRowSeq = treeGrid
          .getTreeView()
          .getSummary("sort_seq", SummaryType.MAX);
      }

      // const maxRowSeq = treeGrid.getTreeView().getSummary('sort_seq', 'max');
      const newMenuObj = {
        parent_menu_sno: 0,
        menu_sno: Number(getUniqueValue().substring(9, 14)),
        menu_name: "",
        sort_seq: maxRowSeq + 1,
        user_id: userInfo.user_id,
      };
      //최상위 부모계층에 추가.
      treeGrid.addRootRow(newMenuObj);
      const count = treeGrid.getItemCount();
      treeGrid.setCurrent(count);

      if (parentID === 0) return;
    };

    const minusRow = async () => {
      const curr = treeGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          treeGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    const nodeMoveUp = () => {
      //노드를 한 줄 위로 이동하기
      treeGrid.nodeMoveUp();
    };

    const nodeMoveDown = () => {
      treeGrid.nodeMoveDown();
    };
    // const search = () => {};

    // const setting = () => {};
    const gridBtnEvent = (type: any) => {
      switch (type) {
        case GridHdBtnType.plus:
          addRow();
          break;
        case GridHdBtnType.minus:
          minusRow();
          break;
        case GridHdBtnType.up:
          nodeMoveUp();
          break;
        case GridHdBtnType.down:
          nodeMoveDown();
          break;
        case GridHdBtnType.reflash:
          treeGrid.reflashRow(originRows);
          // treeGrid.getTreeProvider().setObjectRows({ rows: originRows }, 'rows', '', 'icon');

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
        <div className="realGrid" id="treeUserGrid"></div>
      </div>
    );
  }
);
export default DetailGrid;
