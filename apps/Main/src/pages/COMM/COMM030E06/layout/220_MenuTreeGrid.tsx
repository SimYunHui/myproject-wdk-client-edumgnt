/**
 *  관리감독자 업무일지 목록
 */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { error, info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from "./220_MenuTreeGridConfig";
// import { ESTreeGrid } from "@vntgcorp/vntg-wdk-client";
import { useConfirm } from "@vntgcorp/vntg-wdk-client";
import { GridFitStyle, SortDirection } from "realgrid";
import { DetailTreeGridRowDataType } from "./Types";
import ESTreeGrid from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";
type MasterGridProps = {
  title: string;
  originRows: DetailTreeGridRowDataType[];
  onSelectRow?: any;
  saveData?: any;
  ref?: any;
  addMenuData?: any;
  onAddMenuData?: any;
  refreshState?: any;
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
  (
    {
      title,
      originRows,
      onSelectRow,
      onAddMenuData,
      addMenuData,
      refreshState,
    },
    ref
  ) => {
    const { isConfirmed } = useConfirm();
    const [groupSno, setGroupSno] = useState<number>();
    /**
     * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
     * @param str       : 체크할 문자열
     */
    function isEmpty(data: any) {
      if (typeof data == "undefined" || data == null || data == "") return true;
      else return false;
    }
    useImperativeHandle(ref, () => ({
      setRowData(data: any) {
        if (data) {
          treeGrid.clearRow();
          treeGrid
            .getTreeProvider()
            .setObjectRows({ rows: data }, "rows", "", "icon");
        } else {
          treeGrid.clearRow();
        }
        treeGrid.getTreeView().expandAll();
      },
      toSave() {
        treeGrid.getTreeView().commit();
        const updatedRows = treeGrid.CheckGridData();
        return updatedRows;
      },
      getProgramList(data: any) {
        setGroupSno(data);
      },
      cleanup() {
        treeGrid.clearRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = treeGrid.getRowStateCount("*");
        return rowCnt;
      },
    }));

    useEffect(() => {
      treeGrid = new ESTreeGrid("treeMenuGrid");
      treeGrid.initializeGrid(Config, originRows);

      treeGrid.setLookup("system_type", "AA02");
      treeGrid.setLookup("pgm_type", "AA10");
      treeGrid.setLookup("menu_type", "AA13");
      treeGrid.setBoolColumn("use_yn");
      treeGrid.setBoolColumn("save_yn");
      treeGrid.setBoolColumn("custom_yn");
      treeGrid.setBoolColumn("print_yn");
      treeGrid.setBoolColumn("select_yn");
      treeGrid.getTreeView().sortingOptions.enabled = false;
      treeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);
      treeGrid.getTreeView().displayOptions.fitStyle = GridFitStyle.NONE;

      treeGrid.onCellEdited((grid, _itemIndex, _row, _field) => {
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
      // 그리드 Row Focus 변경 시 Eventgrid
      treeGrid.onCurrentRowChanged((row) => {
        onSelectRow(row);
      });
      return () => {
        treeGrid.clearRow();
        treeGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (addMenuData.keys !== undefined) {
        //두 배열,
        // addMenuData: 팝업에서 추가한 메뉴, originRows: 기존 그룹 메뉴
        // 정렬된 추가 메뉴 리스트
        // 최종 추가완료된 메뉴 리스트
        const finalDataList = [...originRows];
        let countExist = 0;
        for (let i = 0; i < addMenuData.length; i++) {
          let selfExist = false;

          for (let j = 0; j < finalDataList.length; j++) {
            if (
              addMenuData[i].menu_tree_sno == finalDataList[j].menu_tree_sno
            ) {
              selfExist = true;
              countExist++;
            }
          }

          if (selfExist == false) {
            if (addMenuData[i].parent_menu_tree_sno == 0) {
              finalDataList.push(addMenuData[i]);
              treeGrid.getTreeProvider().addChildRow(null, addMenuData[i]);
            } else {
              const ret = treeGrid.getTreeProvider().searchData({
                fields: ["menu_tree_sno"],
                value: addMenuData[i].parent_menu_tree_sno,
                wrap: true,
              });
              if (ret) {
                const rowId = ret.dataRow;
                treeGrid.getTreeProvider().addChildRow(rowId, addMenuData[i]);
              }
            }
          }
        }
        if (addMenuData.length === countExist) {
          warning("추가하려는 메뉴가 이미 존재합니다.");
          refreshState();
        }
        treeGrid.getTreeView().refresh(true);
      }
      treeGrid.getTreeView().expandAll();
    }, [addMenuData]);

    const addRow = () => {
      const isNullProgramList = isEmpty(groupSno);
      const menuTreeData = treeGrid
        .getTreeProvider()
        .getJsonRows(null, true, "childRows", "", false);
      if (isNullProgramList == true) {
        error("그룹을 선택해주세요!");
      } else {
        onAddMenuData(menuTreeData);
      }
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

    //임시: 모두 펼치기
    const nodeMoveUp = () => {
      treeGrid.getTreeView().expandAll();
      treeGrid.getFocusedRowHandle();
    };
    //임시: 선택행 하위 펼치기
    const rootaddRow = () => {
      const curr = treeGrid.getFocusedRowHandle();
      treeGrid.getTreeView().expand(curr.itemIndex, true, true);
    };
    //임시: 모두 접기
    const nodeMoveDown = () => {
      treeGrid.getTreeView().collapseAll();
      treeGrid.getFocusedRowHandle();
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
          treeGrid.reflashRow(originRows);
          break;
        case GridHdBtnType.newfolder:
          rootaddRow();
          break;
        case GridHdBtnType.up:
          nodeMoveUp();
          break;
        case GridHdBtnType.down:
          nodeMoveDown();
          break;
        default:
          break;
      }
    };

    return (
      <div className="grid">
        <GridHeader title={title} type="default" gridBtnEvent={gridBtnEvent} />
        <div className="realGrid" id="treeMenuGrid"></div>
      </div>
    );
  }
);
export default TreeGrid;
