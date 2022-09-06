/**
 * 프로그램 정보 등록 마스터 그리드
 * By GT
 */
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./210_DetailGridConfig";
// import ESTreeGrid from "@vntgcorp/vntg-wdk-client";
import { DetailGridRowDataType } from "../util/Types";
import { SortDirection } from "realgrid";
import ESTreeGrid from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";
/**
 *
 * @param {*} title
 * @param {*} originRows
 * @function saveData
 * @param {*} leftSearchValue
 * @param {*}rightSearchValue
 * @param ref
 */

type DetailGridProps = {
  title: string;
  originRows: DetailGridRowDataType[];
  onSelectRow?: (data: any) => void;
  ref?: React.ReactNode;
};
let treeGrid: ESTreeGrid;
const DetailGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows }, ref) => {
    useImperativeHandle(ref, () => ({
      setRowData(data: any) {
        if (data) {
          console.log("tree, data 생성");
          treeGrid.clearRow();
          console.log("treeProvider clearRows 실행");
          treeGrid
            .getTreeProvider()
            .setObjectRows({ rows: data }, "rows", "", "icon");
          treeGrid.getTreeView().expandAll();
        } else {
          treeGrid.clearRow();
        }
      },
      cleanup() {
        treeGrid.clearRow();
      },
    }));

    useEffect(() => {
      console.log("  <<< Start Effect DetailTreeGrid.js >>> ");
      treeGrid = new ESTreeGrid("detailGrid");
      treeGrid.initializeGrid(Config, originRows);

      treeGrid.setLookup("pgm_type", "AA10");
      treeGrid.setBoolColumn("use_yn");
      treeGrid.setBoolColumn("select_yn");
      treeGrid.setBoolColumn("save_yn");
      treeGrid.setBoolColumn("print_yn");
      treeGrid.setBoolColumn("custom_yn");
      treeGrid.getTreeView().sortingOptions.enabled = false;
      treeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);
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
      // // 행 선택시 하위 행 모두 펼치기
      // treeGrid.getTreeView().onCellClicked = function (grid: any, clickData: any) {
      //   const row = clickData.dataRow;
      //   if (row > -1) {
      //     treeGrid.getTreeView().expand(treeGrid.getItemIndex(), true, true);
      //   }
      // };
      // // 행 더블 클릭시 하위 행 모두 펼치기
      // treeGrid.getTreeView().onCellDblClicked = function (grid: any, clickData: any) {
      //   const row = clickData.dataRow;
      //   if (row > -1) {
      //     treeGrid.getTreeView().collapse(treeGrid.getItemIndex(), true);
      //   }
      // };
      return () => {
        console.log("▶︎▶︎▶︎ MenuTreeGrid.tsx CleanUp");
        treeGrid.clearRow();
        treeGrid.destroy();
      };
    }, []);

    return (
      <div className="grid">
        <GridHeader title={title} />
        <div className="realGrid" id="detailGrid"></div>
      </div>
    );
  }
);
export default DetailGrid;
