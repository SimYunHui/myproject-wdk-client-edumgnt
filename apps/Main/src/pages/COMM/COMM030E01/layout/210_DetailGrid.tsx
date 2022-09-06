/**
 * 프로그램 정보 등록 마스터 그리드
 * By GT
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { error, info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { DETAILFIELD } from "./constants";
import { Config } from "./210_DetailGridConfig";

type DetailGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;

  ref?: any;
};
let detailGrid: ESGrid;
export const DetailGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows, saveData }, ref) => {
    const [rowsData, setRowsData] = useState<any>();
    const { isConfirmed } = useConfirm();

    const [systemCode, setSystemCode] = useState<any>();

    useImperativeHandle(ref, () => ({
      toSave() {
        if (!detailGrid.validateCells(null, true)) {
          try {
            const updatedRows = detailGrid.checkGridData();
            const data = detailGrid.getDataProvier().getJsonRows(0, -1, true);
            let count = 0;
            data.map((row) => {
              type objectKey = keyof typeof row;
              updatedRows.map((drow) => {
                if (row["pgm_id" as objectKey] === drow["pgm_id"]) {
                  count++;
                }
              });
            });
            if (count > 1) {
              return error("해당 프로그램ID 가 이미 존재합니다 ! (Key값 중복)");
            }
            saveData(updatedRows);
          } catch (error) {
            detailGrid.getGridView().cancel();
            warning("행 편집을 완료해주세요");
            saveData([]);
          }
        } else {
          warning('"프로그램 정보 등록" 유효성검사 오류');
          saveData([]);
        }
      },

      getSystemCode(data: any) {
        setSystemCode(data);
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
      detailGrid.setLookup("pgm_type", "AA10");
      detailGrid.setBoolColumn("use_yn");
      detailGrid.setEvenFillStyle();
      detailGrid.onCellClicked(onCellClick);
      detailGrid.setIsNotEmptyColumn(["pgm_id", "pgm_name", "pgm_type"]);
      // 특정 컬럼 추가된 행만 수정 가능
      detailGrid.setColumnStyleCallback(DETAILFIELD.PGM_ID, setEditable);
      detailGrid.onCellEdited((grid, _itemIndex, _row, _field) => {
        if (!grid.validateCells(null, true)) {
          grid.commit(true);
        } else {
          try {
            grid.commit(false);
          } catch (error) {
            // builderror : Empty block statement
          }
        }
      });
      return () => {
        detailGrid.destroy();
      };
    }, []);

    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
      detailGrid.setRows(originRows);
      setRowsData(originRows);
    }, [originRows]);
    /**
     * 특정 컬럼 추가된 행만 수정 가능
     * @param _grid
     * @param dataCell
     * @returns
     */
    const setEditable = function (
      _grid: any,
      dataCell: { index: { dataRow: number } }
    ) {
      const rowState = detailGrid
        .getDataProvier()
        .getRowState(dataCell.index.dataRow);

      const ret = { editable: false };
      if (rowState == "created") {
        ret.editable = true;
      }
      return ret;
    };
    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: any) => {
      if (object.dataRow !== undefined) {
        if (!detailGrid.isCheckedRow(object.dataRow)) {
          detailGrid.onCheckRows(object.dataRow, true);
        } else detailGrid.onCheckRows(object.dataRow, false);
      }
    };
    const addRow = () => {
      detailGrid.insertWithValidation({ pgm_id: systemCode, use_yn: "Y" });
      detailGrid.setFirstRowFocused(true);
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

    const gridBtnEvent = (type: any) => {
      switch (type) {
        case GridHdBtnType.plus:
          addRow();
          break;
        case GridHdBtnType.minus:
          minusRow();
          break;
        case GridHdBtnType.reflash:
          detailGrid.reflashRow(originRows);
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
        <div className="realGrid" id="detailGrid"></div>
      </div>
    );
  }
);
