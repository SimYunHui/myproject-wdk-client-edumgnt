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
  relationFields?: any;
  addData?: any;
  onAddData?: () => void;
  ref?: React.ReactNode;
};

let detailGrid: ESGrid;
const DetailGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows, relationFields, addData, onAddData }, ref) => {
    const detailgridRef = useRef(null);
    const { isConfirmed } = useConfirm();

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = detailGrid.getCudRows();
        return updatedRows;
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
      detailGrid.setBoolColumn("system_yn");
      detailGrid.setBoolColumn("use_yn");
      // detailGrid.setLookup('role_type', 'AA14');
      const gridControlOptions = {
        editable: false,
        updatable: false,
        insertable: false,
        appendable: false,
        deletable: true,
        softDeleting: true,
      };
      detailGrid.setGridOptions(gridControlOptions);
      // 그리드 Cell 선택 시 Event
      detailGrid.onCellClicked(onCellClick);
      return () => {
        detailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      detailGrid.setRows(originRows);
    }, [originRows]);

    useEffect(() => {
      addData.map(
        (index: {
          role_no: any;
          role_type: any;
          role_name: any;
          system_yn: any;
          use_yn: any;
          remark: any;
        }) => {
          if (index.role_no) {
            const cmUserRole = {
              user_id: relationFields,
              role_no: index.role_no,
              role_type: index.role_type,
              role_name: index.role_name,
              system_yn: index.system_yn,
              use_yn: index.use_yn,
              remark: index.remark,
              row_stat: "added",
              __rowState: "created",
            };
            detailGrid.appendRow(cmUserRole);
          }
        }
      );
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
        warning('"사용자 목록" 을 선택하세요');
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
        <div className="realGrid" id="detailGrid" ref={detailgridRef}></div>
      </div>
    );
  }
);
export default DetailGrid;
