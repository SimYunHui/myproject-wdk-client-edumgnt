import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Config } from "./211_FirstPopModalGridConfig";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { FirstDetailGridRowDataType } from "./Types";

type ModalGridProps = {
  originRows?: FirstDetailGridRowDataType[];
  onSelectRow?: (data: any) => void;
  ref?: React.ReactNode;
};

let modalGrid: ESGrid;
const ModalGrid: React.FC<ModalGridProps> = forwardRef(
  ({ originRows, onSelectRow }, ref) => {
    useImperativeHandle(ref, () => ({
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
          const checkedList = rows.map((rows) => originRows[rows]);
          return checkedList;
        }
      },
    }));

    useEffect(() => {
      modalGrid = new ESGrid("modalgrid");
      modalGrid.initializeGrid(Config, originRows);
      modalGrid.setLookup("system_type", "AA02");
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
      modalGrid.setEvenFillStyle();
      /**
       * 선택-onCellDblClicked
       */
      modalGrid.getGridView().onCellDblClicked = function (
        grid,
        clickData: { [x: string]: string }
      ) {
        const row = clickData["dataRow"];

        if (typeof row != "number") return;
        if (row > -1) {
          const rowInfo = grid.getCurrent();
          const rowVal = grid.getDataSource().getJsonRow(rowInfo.dataRow, true);
          onSelectRow([rowVal]);
        }
      };

      return () => {
        modalGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (modalGrid) {
        //Empty block statement  no-empty
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
