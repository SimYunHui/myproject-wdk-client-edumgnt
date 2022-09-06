/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./220_DetailProgramSubGridConfig";
import { DETAILSUBFIELD } from "../util/constants";

export type DetailSubGridHandler = {
  toSave: () => any[];
  getProgramList: (data: any) => void;
  changeData: () => number;
};

type DetailProgramSubGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;
  relationFields?: any;
  onAddUserData?: any;
  ref?: any;
};
let prgParmsDetailGrid: ESGrid;
const DetailProgramSubGrid: React.FC<DetailProgramSubGridProps> = forwardRef(
  ({ title, originRows, relationFields }, ref) => {
    const { isConfirmed } = useConfirm();
    const [rowsData, setRowsData] = useState([]);
    const [programList, setProgramList] = useState<string>();

    /**
     * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
     * @param str       : 체크할 문자열
     */
    // function isEmpty(data: any) {
    //   if (typeof data == 'undefined' || data == null || data == '') return true;
    //   else return false;
    // }

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = prgParmsDetailGrid.checkGridData();
        if (updatedRows) {
          return updatedRows;
        }
      },
      getProgramList(data: string) {
        setProgramList(data);
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
        // 특정 컬럼 추가된 행만 수정 가능
        prgParmsDetailGrid.setColumnStyleCallback(
          DETAILSUBFIELD.PARAM_NAME,
          setEditable
        );
        /**
         * 선택시
         */
        prgParmsDetailGrid.getGridView().onCellClicked = function (
          grid: any,
          clickData: any
        ) {
          const row = clickData.dataRow;

          if (typeof row != "number") return;
          if (row > -1) {
            const rowInfo = grid.getCurrent();
            const rowVal = grid
              .getDataSource()
              .getJsonRow(rowInfo.dataRow, true);
            console.log("Selected Row Data is  : ", [rowVal]);
            // onSelectRow([rowVal]);
          }
        };
      }
    }, [prgParmsDetailGrid]);

    useEffect(() => {
      prgParmsDetailGrid.setRows(originRows);
      setRowsData(originRows);
      // prgParmsDetailGrid.setFirstRowFocused(true);
    }, [originRows]);

    /**
     * 특정 컬럼 추가된 행만 수정 가능
     * @param grid
     * @param dataCell
     * @returns
     */
    const setEditable = function (
      _grid: any,
      dataCell: { index: { dataRow: number } }
    ) {
      const rowState = prgParmsDetailGrid
        .getDataProvier()
        .getRowState(dataCell.index.dataRow);

      const ret = { editable: false };
      if (rowState == "created") {
        ret.editable = true;
      }
      return ret;
    };

    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    const addRow = () => {
      console.log(relationFields);
      if (relationFields.tree_level === 1) {
        warning("최상위 메뉴에는 추가할 수 없습니다.");
      } else if (relationFields !== undefined && relationFields.length !== 0) {
        const cmPrgParm = {
          run_sno: programList,
          row_stat: "added",
          __rowState: "created",
        };
        prgParmsDetailGrid.appendRow(cmPrgParm);
      } else {
        warning("프로그램 목록을 선택하세요");
      }
    };

    const minusRow = async () => {
      const curr = prgParmsDetailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          prgParmsDetailGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    // const dataDownload = () => {
    //   //https://docs.realgrid.com/guides/tip/excel-import
    //   console.log(prgParmsDetailGrid);
    // };
    const reflashRow = () => {
      prgParmsDetailGrid.reflashRow(originRows);
    };
    const gridBtnEvent = (type: any) => {
      switch (type) {
        case GridHdBtnType.plus:
          addRow();
          break;
        case GridHdBtnType.minus:
          minusRow();
          break;
        case GridHdBtnType.reflash:
          reflashRow();
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
        <div className="realGrid" id="prgParmsDetailGrid"></div>
      </div>
    );
  }
);
export default DetailProgramSubGrid;
