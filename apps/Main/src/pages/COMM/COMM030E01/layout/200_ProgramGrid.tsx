/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { CellIndex, GridBase } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./200_ProgramGridConfig";

type MasterGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  onRowState?: () => number;
  ref?: any;
  saveMasterData?: any;
  cleanupOther?: () => void;
};
let masterGrid: ESGrid;

export const Grid: React.FC<MasterGridProps> = forwardRef(
  ({ title, originRows, onSelectRow, onRowState, cleanupOther }, ref) => {
    const [rowsData, setRowsData] = useState<any>();
    // eslint-disable-next-line no-empty-pattern
    const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
    const [rowCnt, setRowCnt] = useState<number>(null);
    const { isConfirmed } = useConfirm();

    useImperativeHandle(ref, () => ({
      toSave() {
        //
      },
      cleanup() {
        masterGrid.clearnRow();
        setRowCnt(null);
      },
    }));

    useEffect(() => {
      masterGrid = new ESGrid("programgrid");
      masterGrid.initializeGrid(Config, originRows);
      masterGrid.setBoolColumn("use_yn");
      masterGrid.setEvenFillStyle();
      masterGrid.onCurrentRowChanged((row) => {
        onSelectRow(row.value);
      });

      const gridView = masterGrid.getGridView();
      gridView.onCurrentChanging = function (
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
        masterGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (masterGrid) {
        masterGrid.setFirstRowFocused(true);
      }
    }, [originRows]);

    useEffect(() => {
      masterGrid.setRows(originRows);
      setRowsData(originRows);
      setRowCnt(originRows.length);
    }, [originRows]);

    return (
      <div className="grid">
        <GridHeader title={title} rowCnt={rowCnt} />
        <div className="realGrid" id="programgrid"></div>
      </div>
    );
  }
);
