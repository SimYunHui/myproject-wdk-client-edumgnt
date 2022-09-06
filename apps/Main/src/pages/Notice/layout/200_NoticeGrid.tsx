/**
 * 공지사항
 *  - 공지사항 목록
 *
 * @module SearchForm
 * @author bum
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { DataValues } from "realgrid";
import { useRecoilValue } from "recoil";
import { ESGrid, GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { useGrid } from "@vntgcorp/vntg-wdk-client";
import { User } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";
// import { GridHdBtnType, GridHeader } "@vntgcorp/vntg-wdk-client";
import { roleArrayState } from "@vntgcorp/vntg-wdk-client";
import { NoticeGridConfig } from "./200_NoticeGridConfig";

let masterGrid: ESGrid | any;

type GridProps = {
  rows: DataValues[];
  empInfo: User;
  onSelectRow: (row: any) => void;
  onClickRow: (row: any) => void;
  moveDetail: (row: any) => void;
  styles?: React.CSSProperties;
  ref?: any;
};

export type GridRefHandle = {
  cleanup: () => void;
  getData: () => Array<any>;
};

export const getGridValues = () => {
  const updateRows = masterGrid.getCudRows();
  return updateRows;
};

export const setGridValue = (name: string, value: string) => {
  const { dataRow } = masterGrid.getFocusedRowHandle();
  if (dataRow === -1) return;

  if (name === "attach_group_id") name = "attach_group_id";
  masterGrid.setValue(dataRow, name, value);
};

export const NoticeGrid = forwardRef<GridRefHandle, GridProps>(
  ({ rows, empInfo, onSelectRow, onClickRow, moveDetail, styles }, ref) => {
    const [gridRows, setGridRows] = useState<DataValues[]>();
    const [rowCnt, setRowCnt] = useState<number>(null);
    const [editable, setEditable] = useState(true);
    const userRole: Array<string> = useRecoilValue(roleArrayState);

    useEffect(() => {
      setGridRows(rows);
    }, [rows]);

    useImperativeHandle(ref, () => ({
      cleanup() {
        setGridRows([]);
        setRowCnt(null);
      },
      getData() {
        return masterGrid.getCudRows();
      },
    }));
    masterGrid = useGrid("NoticeGrid", NoticeGridConfig);

    useEffect(() => {
      // masterGrid = new ESGrid('NoticeGrid', NoticeGridConfig);
      if (!masterGrid.isLoad) return;
      masterGrid.setEvenFillStyle();
      masterGrid.onCurrentRowChanged(onClickRow);
      masterGrid.onCellDblClicked(onSelectRow);
      masterGrid.setLookup("busi_place", "CM18");
      masterGrid.setLookup("system_type", "AA02");
      masterGrid.setLookup("board_all_yn", "CM21");
      masterGrid.setLookup("board_type", "CM20");
      setEditable(empInfo.system_type === "S01");
      // masterGrid.changed

      // return () => {
      //   masterGrid.destroy();
      // };
    }, [masterGrid.isLoad]);

    useEffect(() => {
      if (gridRows) {
        masterGrid.setRows(gridRows);
        setRowCnt(gridRows.length);
      }
    }, [gridRows]);

    const addRow = () => {
      const tempParamObj = {
        corp_code: "01",
        write_user_name: empInfo.user_name,
        write_user_id: empInfo.user_id,
        article_sno: -1,
        delete_yn: "N",
        pwd: "",
        busi_place: empInfo.busi_place,
        board_all_yn: "Y",
        board_type: "01",
        system_type: "S01",
        attach_group_id: "",
        pwd_use_yn: "",
        row_stat: "added",
        write_date: new Date(),
      };
      masterGrid.insertWithValidation(tempParamObj);
    };

    const gridBtnEvent = (type: any) => {
      switch (type) {
        case GridHdBtnType.plus: {
          const newRow = masterGrid.createRow();
          newRow.value["corp_code"] = "01";
          newRow.value["write_user_name"] = empInfo.user_name;
          newRow.value["write_user_id"] = empInfo.user_id;
          newRow.value["article_sno"] = -1;
          newRow.value["busi_place"] = empInfo.busi_place;
          newRow.value["board_all_yn"] = "Y";
          newRow.value["board_type"] = "01";
          newRow.value["system_type"] = "S01";
          newRow.value["delete_yn"] = "N";
          newRow.value["pwd"] = "";
          newRow.value["pwd_use_yn"] = "";
          newRow.value["attach_group_id"] = "";
          newRow.value["write_date"] = new Date();
          newRow.value["row_stat"] = "added";
          addRow();
          moveDetail(newRow);
          break;
        }
        case GridHdBtnType.minus: {
          const curr = masterGrid.getFocusedRowHandle();
          const ret = masterGrid
            .getGridView()
            .getValue(curr.dataRow, "write_user_id");
          if (ret == empInfo.user_id || userRole.includes("AUTH011")) {
            masterGrid.getGridView().cancel();
            masterGrid.deleteRow();
            masterGrid
              .getGridView()
              .setValue(curr.dataRow, "row_stat", "deleted");
          } else {
            info("공지사항 관리자 및 작성자만 삭제 가능합니다.");
          }
          break;
        }
        case GridHdBtnType.reflash: {
          masterGrid.getGridView().cancel();
          masterGrid.setRows(gridRows);
          break;
        }
        case GridHdBtnType.right:
          break;
        case GridHdBtnType.left:
          break;
        case GridHdBtnType.leftshift:
          break;
        case GridHdBtnType.rightshift:
        default:
          break;
      }
    };
    return (
      <div className="grid" style={styles}>
        <GridHeader
          title={"공지사항"}
          type="default"
          gridBtnEvent={gridBtnEvent}
          editable={editable}
          rowCnt={rowCnt}
        />
        <div className="realGrid" id="NoticeGrid"></div>
      </div>
    );
  }
);
