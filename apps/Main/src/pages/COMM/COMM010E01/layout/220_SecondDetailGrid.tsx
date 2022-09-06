import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./220_SecondDetailGridConfig";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { SecondDetailGridRowDataType } from "./Types";

type SecondDetailGridProps = {
  title: string;
  originRows: SecondDetailGridRowDataType[];
  onSelectRow?: (data: SecondDetailGridRowDataType) => void;
  relationFields?: any;
  addData?: any;
  onAddData?: () => void;
  ref?: React.ReactNode;
};

let secondDetailGrid: ESGrid;
const SecondDetailGrid: React.FC<SecondDetailGridProps> = forwardRef(
  ({ title, originRows, relationFields, addData, onAddData }, ref) => {
    const { isConfirmed } = useConfirm();
    const seconddetailgridRef = useRef(null);

    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = secondDetailGrid.getCudRows();
        return updatedRows;
      },
      cleanup() {
        secondDetailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = secondDetailGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      secondDetailGrid = new ESGrid("seconddetailgrid");
      secondDetailGrid.initializeGrid(Config, originRows);
      secondDetailGrid.setBoolColumn("system_yn");
      secondDetailGrid.setBoolColumn("use_yn");
      secondDetailGrid.setLookup("role_type", "AA14");
      const gridControlOptions = {
        editable: false,
        updatable: false,
        insertable: false,
        appendable: false,
        deletable: true,
        softDeleting: true,
      };
      secondDetailGrid.setGridOptions(gridControlOptions);
      secondDetailGrid.orderBy(["role_no"], ["ascending"]);
      // 그리드 Cell 선택 시 Event
      secondDetailGrid.onCellClicked(onCellClick);
      return () => {
        secondDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      secondDetailGrid.setRows(originRows);
    }, [originRows]);

    useEffect(() => {
      addData.map((index: SecondDetailGridRowDataType) => {
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
          secondDetailGrid.appendRow(cmUserRole);
        }
      });
    }, [addData]);

    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: { dataRow: number[] }) => {
      if (object.dataRow !== undefined) {
        if (!secondDetailGrid.isCheckedRow(object.dataRow)) {
          secondDetailGrid.onCheckRows(object.dataRow, true);
        } else secondDetailGrid.onCheckRows(object.dataRow, false);
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
      const curr = secondDetailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          secondDetailGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };

    const reflashRow = () => {
      secondDetailGrid.reflashRow(originRows);
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
          id="seconddetailgrid"
          ref={seconddetailgridRef}
        ></div>
      </div>
    );
  }
);

export default SecondDetailGrid;
