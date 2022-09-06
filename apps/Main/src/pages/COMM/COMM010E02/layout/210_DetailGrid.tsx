import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./210_DetailGridConfig";
import { DetailGridRowDataType } from "./Types";

type DetailGridProps = {
  title: string;
  originRows: DetailGridRowDataType[];
  onSelectRow?: (data: DetailGridRowDataType) => void;
  relationFields?: any;
  addData?: any;
  onAddData?: () => void;
  ref?: React.ReactNode;
};

let detailGrid: ESGrid;
const DetailGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows, relationFields, addData, onAddData }, ref) => {
    const { isConfirmed } = useConfirm();
    const detailgridRef = useRef(null);

    useImperativeHandle(ref, () => ({
      toSave() {
        if (!detailGrid.validateCells(null, true)) {
          const updatedRows = detailGrid.getCudRows();
          return updatedRows;
        } else {
          warning("warning : 그룹 목록 >> Validation 오류");
          return [];
        }
      },
      cleanup() {
        detailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = detailGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      detailGrid = new ESGrid("detailGrid");
      detailGrid.initializeGrid(Config, originRows);
      detailGrid.setLookup("user_level", "AA03");
      detailGrid.setBoolColumn("use_yn");
      const gridControlOptions = {
        editable: false,
        updatable: false,
        insertable: false,
        appendable: false,
        deletable: true,
        softDeleting: true,
      };
      detailGrid.setGridOptions(gridControlOptions);
      detailGrid.orderBy(["user_id"], ["ascending"]);
      // 그리드 Cell 선택 시 Event
      detailGrid.onCellClicked(onCellClick);
      detailGrid.setEvenFillStyle();
      return () => {
        detailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      detailGrid.setRows(originRows);
    }, [originRows]);

    useEffect(() => {
      addData.map((index: DetailGridRowDataType) => {
        if (index.user_id) {
          const cmGroupUsers = {
            group_sno: relationFields,
            user_id: index.user_id,
            user_name: index.user_name,
            user_level: index.user_level,
            emp_no: index.emp_no,
            remark: index.remark,
            row_stat: "added",
            __rowState: "created",
          };
          detailGrid.appendRow(cmGroupUsers);
        }
      });
    }, [addData]);

    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: { dataRow: number[] }) => {
      if (object.dataRow !== undefined) {
        if (!detailGrid.isCheckedRow(object.dataRow)) {
          detailGrid.onCheckRows(object.dataRow, true);
        } else detailGrid.onCheckRows(object.dataRow, false);
      }
    };

    /**
     * 공통버튼 이벤트
     */
    const addRow = () => {
      if (relationFields !== undefined && relationFields.length !== 0) {
        onAddData();
      } else {
        warning("그룹 목록을 선택하세요");
      }
    };

    const minusRow = async () => {
      const curr = detailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          detailGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    const reflashRow = () => {
      detailGrid.reflashRow(originRows);
    };

    const gridBtnEvent = (type: string) => {
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
        <div className="realGrid" id="detailGrid" ref={detailgridRef}></div>
      </div>
    );
  }
);
export default DetailGrid;
