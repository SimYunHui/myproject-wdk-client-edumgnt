/**
 *  메뉴 권한 등록 개인 메뉴 리스트 등록
 * By Pang
 */
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { SortDirection, SummaryType } from "realgrid";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { getUniqueValue } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./210_DetailProgramGridConfig";

/**
 *
 * @param {*} title
 * @param {*} originRows
 * @function saveData

 * @param ref
 */
export type DetailGridHandler = {
  toSave: () => any[];
  changeData: () => number;
};

type DetailGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;
  onSelectDetailRow?: any;
  relationFields?: any;
  addGroupData?: any;
  onAddGroupData?: any;
  ref?: any;
};
let programDetailGrid: ESGrid;
const DetailProgramGrid: React.FC<DetailGridProps> = forwardRef(
  (
    {
      title,
      originRows,
      onSelectDetailRow,
      relationFields,
      addGroupData,
      onAddGroupData,
    },
    ref
  ) => {
    const { isConfirmed } = useConfirm();
    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = programDetailGrid.checkGridData();
        if (updatedRows) {
          return updatedRows;
        }
      },

      cleanup() {
        programDetailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = programDetailGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      programDetailGrid = new ESGrid("programDetailGrid");
      return () => {
        programDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (programDetailGrid) {
        console.log("programDetailGridinit");
        programDetailGrid.initializeGrid(Config, originRows);
        // const gridView = programDetailGrid.getGridView();
        programDetailGrid.setBoolColumn("use_yn");
        programDetailGrid.setEvenFillStyle();
        programDetailGrid
          .getGridView()
          .orderBy(["sort_seq"], [SortDirection.ASCENDING]);
        // 그리드 Row Focus 변경 시 Event
        programDetailGrid.onCurrentRowChanged((row) => {
          onSelectDetailRow(row.value);
        });
      }
    }, [programDetailGrid]);

    useEffect(() => {
      programDetailGrid.setRows(originRows);
      programDetailGrid.setFirstRowFocused(true);
    }, [originRows]);

    useEffect(() => {
      if (addGroupData.keys !== undefined) {
        addGroupData.map((index: { pgm_id: any; pgm_name: any }) => {
          let maxRowSeq = 0;
          maxRowSeq = programDetailGrid
            .getGridView()
            .getSummary("sort_seq", SummaryType.MAX);
          if (isNaN(maxRowSeq)) {
            console.log(true);
            maxRowSeq = 0;
          }
          if (index.pgm_id) {
            console.log(index);
            const cmProgram = {
              pgm_id: index.pgm_id,
              run_sno: Number(getUniqueValue().substring(9, 14)),
              run_name: index.pgm_name,
              menu_sno: relationFields.menu_sno,
              use_yn: "Y",
              sort_seq: maxRowSeq + 1,
              row_stat: "added",
              __rowState: "created",
            };
            programDetailGrid.appendRow(cmProgram);
          }
        });
      }
    }, [addGroupData]);
    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    const addRow = () => {
      if (relationFields.tree_level === 1) {
        warning("최상위 메뉴에는 추가할 수 없습니다.");
      } else if (relationFields !== undefined && relationFields.length !== 0) {
        onAddGroupData();
      }
    };

    const minusRow = async () => {
      const curr = programDetailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          programDetailGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    const reflashRow = () => {
      programDetailGrid.reflashRow(originRows);
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
      }
    };

    return (
      <div className="grid">
        <GridHeader title={title} type="default" gridBtnEvent={gridBtnEvent} />
        <div className="realGrid" id="programDetailGrid"></div>
      </div>
    );
  }
);
export default DetailProgramGrid;
