import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./210_FirstDetailGridConfig";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { SortCase, SortDirection } from "realgrid";
import { FirstDetailGridRowDataType } from "./Types";

type FirstDetailGridProps = {
  title: string;
  originRows: FirstDetailGridRowDataType[];
  onSelectRow?: (data: FirstDetailGridRowDataType) => void;
  relationFields?: any;
  addData?: FirstDetailGridRowDataType[];
  onAddData?: () => void;
  ref?: React.ReactNode;
};

let firstDetailGrid: ESGrid;
const FirstDetailGrid: React.FC<FirstDetailGridProps> = forwardRef(
  ({ title, originRows, relationFields, addData, onAddData }, ref) => {
    const { isConfirmed } = useConfirm();
    const firstdetailgridRef = useRef(null);

    useImperativeHandle(ref, () => ({
      toSave() {
        if (!firstDetailGrid.validateCells(null, true)) {
          const updatedRows = firstDetailGrid.getCudRows();
          return updatedRows;
        } else {
          warning("warning : 사용자 목록 >> Validation 오류");
          return [];
        }
      },
      cleanup() {
        firstDetailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = firstDetailGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      firstDetailGrid = new ESGrid("firstdetailgrid");
      firstDetailGrid.initializeGrid(Config, originRows);
      firstDetailGrid.setLookup("system_type", "AA02");
      firstDetailGrid.setBoolColumn("use_yn");
      firstDetailGrid.onCellClicked(onCellClick);
      firstDetailGrid
        .getGridView()
        .orderBy(
          ["group_sno"],
          [SortDirection.ASCENDING],
          [SortCase.INSENSITIVE]
        );
      firstDetailGrid.setIsNotEmptyColumn(["user_id"]);
      firstDetailGrid.orderBy(["group_name"], ["ascending"]);
      return () => {
        firstDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      firstDetailGrid.setRows(originRows);
    }, [originRows]);

    useEffect(() => {
      addData.map((index) => {
        if (index.group_sno) {
          const cmGroupUsers = {
            user_id: relationFields,
            group_sno: index.group_sno,
            group_name: index.group_name,
            system_type: index.system_type,
            use_yn: index.use_yn,
            remark: index.remark,
            row_stat: "added",
            __rowState: "created",
          };
          firstDetailGrid.appendRow(cmGroupUsers);
        }
      });
    }, [addData]);

    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: { dataRow: number[] }) => {
      if (object.dataRow !== undefined) {
        if (!firstDetailGrid.isCheckedRow(object.dataRow)) {
          firstDetailGrid.onCheckRows(object.dataRow, true);
        } else firstDetailGrid.onCheckRows(object.dataRow, false);
      }
    };

    /**
     * 공통버튼 이벤트
     */
    const addRow = () => {
      if (relationFields !== undefined && relationFields.length !== 0) {
        onAddData();
      } else {
        warning('"사용자 목록" 을 선택하세요');
      }
    };

    const minusRow = async () => {
      const curr = firstDetailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          firstDetailGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    const reflashRow = () => {
      firstDetailGrid.reflashRow(originRows);
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
        <div
          className="realGrid"
          id="firstdetailgrid"
          ref={firstdetailgridRef}
        ></div>
      </div>
    );
  }
);

export default FirstDetailGrid;
