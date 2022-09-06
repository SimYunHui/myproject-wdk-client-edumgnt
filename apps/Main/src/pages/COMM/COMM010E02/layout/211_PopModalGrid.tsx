import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Config } from "./211_PopModalGridConfig";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { DetailGridRowDataType } from "./Types";

type ModalGridProps = {
  originRows?: DetailGridRowDataType[];
  onSelectRow?: (data: DetailGridRowDataType | DetailGridRowDataType[]) => void;
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
          ``;
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
        modalGrid.setLookup("user_level", "AA03");
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
          clickData: { [x: string]: string }
        ) {
          const row = clickData["dataRow"];

          if (typeof row != "number") return;
          if (row > -1) {
            const rowInfo = grid.getCurrent();
            const rowVal: DetailGridRowDataType = grid
              .getDataSource()
              .getJsonRow(rowInfo.dataRow, true);
            onSelectRow(rowVal);
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
