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
import { Config } from "./200_ProgramGridConfig";
import { MasterGridRowDataType } from "../util/Types";

type MasterGridProps = {
  title: string;
  originRows: MasterGridRowDataType[];
  onSelectRow?: (data: any) => void;
  ref?: React.ReactNode;
};
let masterGrid: ESGrid;

const MasterGrid: React.FC<MasterGridProps> = forwardRef(
  ({ title, originRows, onSelectRow }, ref) => {
    const [rowCnt, setRowCnt] = useState<number>(null);
    useImperativeHandle(ref, () => ({
      cleanup() {
        masterGrid.clearnRow();
        setRowCnt(null);
      },
    }));

    useEffect(() => {
      masterGrid = new ESGrid("programgrid");
    }, []);
    useEffect(() => {
      if (masterGrid) {
        masterGrid.initializeGrid(Config, originRows);
        masterGrid.setEvenFillStyle();

        // 그리드 Cell 선택 시 Event
        masterGrid.onCellClicked(onCellClick);
        // 그리드 Row Focus 변경 시 Event
        masterGrid.onCurrentRowChanged((row) => {
          onSelectRow(row.value);
        });
      }
    }, [masterGrid]);
    useEffect(() => {
      masterGrid.setRows(originRows);
      masterGrid.setFirstRowFocused(true);
      setRowCnt(originRows.length);
    }, [originRows]);
    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: any) => {
      if (object.dataRow !== undefined) {
        if (!masterGrid.isCheckedRow(object.dataRow)) {
          masterGrid.onCheckRows(object.dataRow, true);
        } else masterGrid.onCheckRows(object.dataRow, false);
      }
    };

    return (
      <div className="grid">
        <GridHeader title={title} rowCnt={rowCnt} />
        <div className="realGrid" id="programgrid"></div>
      </div>
    );
  }
);
export default MasterGrid;
