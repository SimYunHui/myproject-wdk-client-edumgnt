/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { SortDirection, SummaryType } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { error, info } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./220_DetailSubGridConfig";
import { DetailSubGridRowDataType } from "./Types";

type DetailSubGridProps = {
  title: string;
  originRows: DetailSubGridRowDataType[];
  onSelectRow?: (data: any) => void;
  ref?: React.ReactNode;
};
let detailSubGrid: ESGrid;
const DetailSubGrid: React.FC<DetailSubGridProps> = forwardRef(
  ({ title, originRows }, ref) => {
    const { isConfirmed } = useConfirm();
    const [rowsData, setRowsData] = useState([]);

    const [programList, setProgramList] = useState<any>();
    const [menuSno, setMenuSno] = useState<any>();
    /**
     * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
     * @param str       : 체크할 문자열
     */
    function isEmpty(data: string) {
      if (typeof data == "undefined" || data == null || data == "") return true;
      else return false;
    }

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = detailSubGrid.checkGridData();
        return updatedRows;
        //saveData(updatedRows);
      },
      getProgramList(data: any) {
        setProgramList(data);
      },
      getFocusedMenuSno(data: any) {
        setMenuSno(data);
      },
      cleanup() {
        detailSubGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = detailSubGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      detailSubGrid = new ESGrid("detailSubGrid");

      return () => {
        detailSubGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (detailSubGrid) {
        detailSubGrid.initializeGrid(Config, originRows);
        detailSubGrid.setRows(originRows);
        detailSubGrid.setEvenFillStyle();
        detailSubGrid.getGridView().sortingOptions.enabled = false;
        detailSubGrid
          .getGridView()
          .orderBy(["sort_seq"], [SortDirection.ASCENDING]);
        /**
         * 선택시
         */
        detailSubGrid.getGridView().onCellClicked = function (
          _grid,
          clickData: { [x: string]: any }
        ) {
          const row = clickData["dataRow"];
          if (typeof row != "number") return;
          if (row > -1) {
            // build error => fix
          }
        };
      }
    }, [detailSubGrid]);

    useEffect(() => {
      detailSubGrid.setRows(originRows);
      setRowsData(originRows);
    }, [originRows]);
    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    const addRow = () => {
      const isNullMenuSno = isEmpty(menuSno);
      const isNullProgramList = isEmpty(programList);
      //현재 최대 seq 가져오기.
      let maxRowSeq = detailSubGrid
        .getGridView()
        .getSummary("sort_seq", SummaryType.MAX);
      // seq가 없을 경우 0으로  초기화
      if (isNaN(maxRowSeq)) {
        maxRowSeq = 0;
      }
      if (isNullProgramList == true) {
        error("프로그램을 설정해주세요!");
      } else if (isNullMenuSno == true) {
        error("메뉴를 설정해주세요!");
      } else {
        if (programList.run_sno == -1) {
          error("메뉴가 아닌 하위 프로그램을 선택해주세요!");
        } else {
          detailSubGrid.insertRow({
            menu_sno: menuSno,
            run_sno: programList.run_sno,
            run_name: programList.menu_name,
            user_id: programList.user_id,
            sort_seq: maxRowSeq + 1,
          });
        }
      }
    };

    const minusRow = async () => {
      const curr = detailSubGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          detailSubGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
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
          detailSubGrid.reflashRow(originRows);
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
        <div className="realGrid" id="detailSubGrid"></div>
      </div>
    );
  }
);
export default DetailSubGrid;
