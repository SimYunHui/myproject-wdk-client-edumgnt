/**
 *  관리감독자 업무일지 목록
 */
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { CellIndex, GridBase, SortDirection } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
// import { ESTreeGrid } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./200_MenuTreeGridConfig";
import ESTreeGrid from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";

type MasterGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;
  ref?: any;
  onGetMenuSno?: any;
  onRowState?: () => number;
  cleanupOther?: () => void;
};

let treeGrid: ESTreeGrid;
/**
 *
 * @param {*} ref
 * @param {*} originFields
 * @param {*} originColumns
 * @param {*} originRows
 * */

const TreeGrid: React.FC<MasterGridProps> = forwardRef(
  ({ title, originRows, onSelectRow, onRowState, cleanupOther }, ref) => {
    const { isConfirmed } = useConfirm();
    useImperativeHandle(ref, () => ({
      setRowData(data: any) {
        if (data) {
          console.log("tree, data 생성");

          treeGrid.clearRow();
          console.log("treeProvider clearRows 실행");
          treeGrid
            .getTreeProvider()
            .setObjectRows({ rows: data }, "rows", "", "icon");
        } else {
          treeGrid.clearRow();
        }
      },
      toSave() {
        const curr = treeGrid.getFocusedRowHandle().itemIndex;
        type IcurrObj = {
          parent_menu_tree_sno?: number;
        };
        const currObj: IcurrObj = treeGrid.getValues(curr);
        const currParentId = currObj["parent_menu_tree_sno"];
        console.log(currObj);
        console.log(currParentId);

        const parentItemIndex = treeGrid.getParentItemIndex();

        console.log(parentItemIndex);
        return curr;
      },
      cleanup() {
        treeGrid.clearRow();
      },
    }));

    useEffect(() => {
      console.log("  <<< Start Effect MenuTreeGrid.js >>> ");
      treeGrid = new ESTreeGrid("treeMenuGrid");
      treeGrid.initializeGrid(Config, originRows);

      treeGrid.setLookup("system_type", "AA02");
      treeGrid.getTreeView().sortingOptions.enabled = false;
      // 그리드 Cell 선택 시 Event
      treeGrid.onCellClicked(onCellClick);
      // 그리드 Row Focus 변경 시 Event
      treeGrid.onCurrentRowChanged((row) => {
        onSelectRow(row);
      });

      treeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);

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

      return () => {
        treeGrid.clearRow();
        treeGrid.destroy();
      };
    }, []);
    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: any) => {
      if (object.dataRow !== undefined) {
        if (!treeGrid.isCheckedRow(object.dataRow)) {
          treeGrid.onCheckRows(object.dataRow, true);
        } else treeGrid.onCheckRows(object.dataRow, false);
      }
    };

    return (
      <div className="grid">
        <GridHeader title={title} />
        <div className="realGrid" id="treeMenuGrid"></div>
      </div>
    );
  }
);
export default TreeGrid;
