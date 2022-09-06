import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Config } from "./211_PopModalGridConfig";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { IClickData } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESGrid";
// import { IClickData } from "@vntgcorp/vntg-wdk-client";

type ModalGridProps = {
  originRows?: any;
  onSelectRow?: any;
  ref?: React.ReactNode;
};

let modalGrid: ESGrid;
const ModalGrid: React.FC<ModalGridProps> = forwardRef(
  ({ originRows, onSelectRow }, ref) => {
    useImperativeHandle(ref, () => ({
      onMakeData() {
        const updatedRows = modalGrid.checkGridData();
        return updatedRows;
      },
      cleanup() {
        modalGrid.clearnRow();
      },
      confirm() {
        if (
          modalGrid.getGridView().displayOptions.selectionStyle === "singleRow"
        ) {
          const itemIndex = modalGrid.getGridView().getCurrent().itemIndex;
          const checkedList = [originRows[itemIndex]];
          return checkedList;
        } else {
          const rows = modalGrid.getCheckedRows();
          const checkedList = rows.map(
            (rows: string | number) => originRows[rows]
          );
          return checkedList;
        }
      },
    }));

    useEffect(() => {
      modalGrid = new ESGrid("modalgrid");
      return () => {
        modalGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (modalGrid) {
        modalGrid.initializeGrid(Config, originRows);
        modalGrid.setBoolColumn("system_yn");
        modalGrid.setBoolColumn("use_yn");
        const gridControlOptions = {
          editable: false,
          updatable: false,
          insertable: false,
          appendable: false,
          deletable: false,
          softDeleting: false,
        };
        modalGrid.setGridOptions(gridControlOptions);
        modalGrid.setMultiSelectRows(true);
        /**
         * 선택-onCellDblClicked
         */
        modalGrid.getGridView().onCellDblClicked = function (
          grid,
          clickData: IClickData
        ): void {
          const row = clickData.dataRow;
          if (typeof row != "number") return;

          if (row > -1) {
            const rowInfo = grid.getCurrent();
            const rowVal = grid
              .getDataSource()
              .getJsonRow(rowInfo.dataRow, true);
            onSelectRow([rowVal]);
          }
        };
      }
    }, [modalGrid]);

    useEffect(() => {
      modalGrid.setRows(originRows);
    }, [originRows]);

    return (
      <div
        style={{ position: "relative", maxWidth: "1000px", height: "350px" }}
        className="searchProgramManager"
      >
        {/* Real Grid */}
        <div
          style={{ width: "100%", maxWidth: "1000px", height: "350px" }}
          id="modalgrid"
        ></div>
      </div>
    );
  }
);

export default ModalGrid;
