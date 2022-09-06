/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { GridBase, SortDirection } from "realgrid";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
// import { ESTreeGrid } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./200_MenuTreeGridConfig";
import { IClickData } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESGrid";
import ESTreeGrid from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";

type MasterGridProps = {
  title: string;
  originRows: any;
  ref?: React.ReactNode;
  onSelectMenuObj?: (data: any) => void;
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
  ({ title, originRows, onSelectMenuObj }, ref) => {
    const [parentID, setParentID] = useState(0);
    useImperativeHandle(ref, () => ({
      setRowData(data: any) {
        if (data) {
          // + JSON.stringify(data));
          treeGrid.clearRow();

          treeGrid
            .getTreeProvider()
            .setObjectRows({ rows: data }, "rows", "", "icon");
          // treeGridView.expandAll();
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
      treeGrid = new ESTreeGrid("treeMenuGrid");
      treeGrid.initializeGrid(Config, originRows);

      treeGrid.setLookup("system_type", "AA02");
      treeGrid.getTreeView().sortingOptions.enabled = false;
      treeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);

      treeGrid.getTreeView().onCellClicked = function (
        _grid,
        clickData: IClickData
      ) {
        const row = clickData["dataRow"];
        if (row > -1) {
          const tempObj = treeGrid.getJsonRow(row);
          onSelectMenuObj(tempObj);
          setParentID(tempObj.menu_sno);
        }
      };

      return () => {
        treeGrid.clearRow();
        treeGrid.destroy();
      };
    }, []);

    return (
      <div className="grid">
        <GridHeader title={title} />
        <div className="realGrid" id="treeMenuGrid"></div>
      </div>
    );
  }
);
export default TreeGrid;
