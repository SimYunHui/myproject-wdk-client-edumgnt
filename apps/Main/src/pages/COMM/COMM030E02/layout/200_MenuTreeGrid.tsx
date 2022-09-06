/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { getUniqueValue } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import _ from "lodash";

import { Config } from "./200_MenuTreeGridConfig";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { CellIndex, GridBase, SortDirection, SummaryType } from "realgrid";
import ESTreeGrid from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";

export type MasterGridHandler = {
  toSave: () => any[];
  setRowData: (data: any) => void;
  getSystemType: (sysType: string) => void;
  stateClean: () => void;
};

type MasterGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  saveData?: any;
  ref?: any;
  onGetMenuSno?: any;
  cleanupOther?: () => void;
  onRowState?: () => number;
};

let treeGrid: ESTreeGrid;

/**
 *
 * @param {*} ref
 * @param {*} originFields
 * @param {*} originColumns
 * @param {*} originRows
 * */
const TreeGrid: React.FC<MasterGridProps> = forwardRef(
  ({ title, originRows, onSelectRow, cleanupOther, onRowState }, ref) => {
    const { isConfirmed } = useConfirm();
    const [rowId, setRowId] = useState();
    const [itmIndex, setItmIndex] = useState<number>();
    const [systemType, setSystemType] = useState<string>();
    useImperativeHandle(ref, () => ({
      setRowData(data: any) {
        if (data) {
          treeGrid.clearRow();

          treeGrid
            .getTreeProvider()
            .setObjectRows({ rows: data }, "rows", "", "icon");
          treeGrid.getTreeView().expandAll();
          treeGrid.getTreeView().setCurrent({ itemIndex: itmIndex });
        } else {
          treeGrid.clearRow();
        }
      },
      toSave() {
        treeGrid.getTreeView().commit();
        const updatedRows = treeGrid.CheckGridData();

        const treeObject = treeGrid.getValues(treeGrid.getItemIndex());
        type objectKey = keyof typeof treeObject;

        const currRowId = treeObject["__rowId" as objectKey];
        setRowId(currRowId);
        setItmIndex(treeGrid.getItemIndex());
        return updatedRows;
      },
      getSystemType(sysType: string) {
        setSystemType(sysType);
      },
      stateClean() {
        treeGrid.getTreeProvider().clearRowStates(false, true);
      },
      cleanup() {
        treeGrid.clearRow();
      },
    }));

    useEffect(() => {
      treeGrid = new ESTreeGrid("treeMenuGrid");
      treeGrid.initializeGrid(Config, originRows);

      treeGrid.setLookup("system_type", "AA02");
      treeGrid.setBoolColumn("use_yn");
      treeGrid.getTreeView().sortingOptions.enabled = false;
      treeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);

      // 그리드 Cell 선택 시 Event
      treeGrid.onCellClicked(onCellClick);
      // 그리드 Row Focus 변경 시 Event
      treeGrid.onCurrentRowChanged((row) => {
        onSelectRow(row);
      });
      // 그리드 유효성 검사 (menu_sno, menu_name, system_type)
      treeGrid.setIsNotEmptyColumn(["menu_sno", "menu_name", "system_type"]);

      treeGrid.onCellEdited((grid, _itemIndex, row, _field) => {
        if (!grid.validateCells(null, true)) {
          grid.commit(true);
          onSelectRow(grid.getDataSource().getJsonRow(row, true));
        } else {
          grid.commit(false);
        }
      });

      //행 변경 시, Confirm
      treeGrid.getTreeView().onCurrentChanging = function (
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
        treeGrid.clearRow();
        treeGrid.destroy();
      };
    }, []);

    /**
     * 그리드 Cell 선택 시 Event
     * @param object
     */
    const onCellClick = (object: any) => {
      if (object.dataRow !== undefined) {
        if (!treeGrid.isCheckedRow(object.dataRow)) {
          treeGrid.onCheckRows(object.dataRow, true);
        } else treeGrid.onCheckRows(object.dataRow, false);
      }
    };

    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////
    const rootaddRow = () => {
      const maxRowSeq = treeGrid
        .getTreeView()
        .getSummary("sort_seq", SummaryType.MAX);
      const newMenuObj = {
        parent_menu_sno: 0,
        menu_sno: parseInt(getUniqueValue()),
        menu_name: "",
        system_type: systemType,
        use_yn: "Y",
        icon: "0",
        sort_seq: maxRowSeq + 1,
      };
      // treeGrid.addRootRow(newMenuObj);
      treeGrid.rootInsertWithValidation(newMenuObj);
    };
    const addRow = () => {
      if (treeGrid.getFocusedRowHandle().itemIndex == -1) {
        warning("하위메뉴를 추가할 상위메뉴를 선택해주세요.");
        return;
      }
      const maxRowSeq = treeGrid
        .getTreeView()
        .getSummary("sort_seq", SummaryType.MAX);
      const curr = treeGrid.getFocusedRowHandle().itemIndex;

      const treeObject = treeGrid.getValues(curr);
      type objectKey = keyof typeof treeObject;

      const parentMenuSno = treeObject["menu_sno" as objectKey];
      if (parentMenuSno === "") return;
      if (treeObject["tree_level" as objectKey] !== 1) {
        warning("하위메뉴 혹은 빈메뉴에 메뉴를 추가할 수 없습니다.");
        return;
      }
      treeGrid.getTreeView().expand(curr, true, true);
      const newMenuObj = {
        parent_menu_sno: parentMenuSno,
        menu_sno: parseInt(getUniqueValue()),
        menu_name: "",
        system_type: systemType,
        icon: "0",
        sort_seq: maxRowSeq + 1,
        use_yn: "Y",
      };
      treeGrid.addChildRow(newMenuObj);
    };
    const minusRow = async () => {
      const curr = treeGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed(
          "행 삭제 확인",
          "해당 행을 삭제 하시겠습니까?",
          false
        );
        if (result) {
          treeGrid.deleteRow();
        }
      } else {
        info("삭제할 행을 선택해주세요");
      }
    };
    const gridBtnEvent = (type: any) => {
      switch (type) {
        case GridHdBtnType.plus:
          addRow();
          cleanupOther();
          break;
        case GridHdBtnType.minus:
          minusRow();
          break;
        case GridHdBtnType.reflash:
          treeGrid.reflashRow(originRows);
          onSelectRow([]);
          treeGrid.getTreeView().expandAll();
          break;
        case GridHdBtnType.newfolder:
          rootaddRow();
          cleanupOther();
          break;
        case GridHdBtnType.up:
          treeGrid.nodeMoveUp();
          break;
        case GridHdBtnType.down:
          treeGrid.nodeMoveDown();
          break;
        default:
          break;
      }
    };

    return (
      <div className="grid">
        <GridHeader title={title} type="menu" gridBtnEvent={gridBtnEvent} />
        <div className="realGrid" id="treeMenuGrid"></div>
      </div>
    );
  }
);
export default TreeGrid;
