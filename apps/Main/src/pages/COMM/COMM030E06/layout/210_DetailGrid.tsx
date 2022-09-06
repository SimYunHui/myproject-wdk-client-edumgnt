/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./210_DetailGridConfig";

type DetailGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;
  onAddUserData?: any;
  ref?: any;
};
let prgParmsDetailGrid: ESGrid;
const DetailGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows }, ref) => {
    const [rowsData, setRowsData] = useState([]);

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = prgParmsDetailGrid.checkGridData();
        if (updatedRows) {
          return updatedRows;
        }
      },

      cleanup() {
        prgParmsDetailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = prgParmsDetailGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      prgParmsDetailGrid = new ESGrid("prgParmsDetailGrid");
      return () => {
        prgParmsDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (prgParmsDetailGrid) {
        prgParmsDetailGrid.initializeGrid(Config, originRows);
        prgParmsDetailGrid.setEvenFillStyle();
        /**
         * 선택시
         */
        prgParmsDetailGrid.getGridView().onCellClicked = function (
          _grid: any,
          clickData: any
        ) {
          const row = clickData.dataRow;

          if (typeof row != "number") return;
          if (row > -1) {
            // const rowVal = grid.getDataSource().getJsonRow(rowInfo.dataRow, true);
            // onSelectRow([rowVal]);
          }
        };
      }
    }, [prgParmsDetailGrid]);

    useEffect(() => {
      prgParmsDetailGrid.setRows(originRows);
      setRowsData(originRows);
    }, [originRows]);

    return (
      <div className="grid">
        <GridHeader title={title} />
        <div className="realGrid" id="prgParmsDetailGrid"></div>
      </div>
    );
  }
);
export default DetailGrid;
