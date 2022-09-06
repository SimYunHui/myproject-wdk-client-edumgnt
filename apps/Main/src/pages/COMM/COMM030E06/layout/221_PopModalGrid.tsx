import ESTreeGrid, {
  IClickData,
} from "@vntgcorp/vntg-wdk-client/dist/app/src/common/utils/ESGrid/ESTreeGrid";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { GridFitStyle, SortDirection } from "realgrid";
// import ESTreeGrid, { IClickData } from '../../../common/utils/ESGrid/ESTreeGrid';
import { Config } from "./221_PopModalGridConfig";
type PopGridProps = {
  originRows?: any;
  dataList?: any;
  groupSno?: any;
  originMenuList?: any;
  onSelectRow?: any;
  ref?: any;
};

export type PopupModalRefHandle = {
  cleanup: () => void;
  onMakeData: () => void;
  setRowData: (data: any) => void;
  confirm: () => void;
};

let popTreeGrid: ESTreeGrid;
let sendData: any = [];

let checkedList: any[] = [];
const PopTreeGrid: React.FC<PopGridProps> = forwardRef<
  PopupModalRefHandle,
  PopGridProps
>(({ originRows, dataList, groupSno, originMenuList }, ref) => {
  // const [rootParent, setRootParent] = useState();

  function recursive(data: any) {
    // data : 맨처음 호출시점,checkedlist = 팝업 내에 선택한 추가데이터
    //        재귀호출 된 시점, 상위 부모 data.

    // 부모메뉴일련번호가 0이라면 최상위 레벨이므로 반환.

    console.log(groupSno);
    if (data.parent_menu_tree_sno == 0) {
      if (sendData.length != 0) {
        let exist = false;
        Array.from(sendData).forEach(function (
          item: { [x: string]: string },
          _index,
          _arr
        ) {
          if (item["menu_tree_sno"] == data.menu_tree_sno) {
            exist = true;
          }
        });
        if (exist == false) {
          data.group_sno = groupSno;
          // data.row_stat = 'unchanged';
          sendData.unshift(data);
        }
      } else {
        sendData.push(data);
      }

      return sendData;
    }
    //foreach 문을 통해 현재 팝업 내 메뉴에 부모 item 을 자신에게 재호출한다.
    //orgMenuList를 통해 부모의 행을 찾아 추가해준다
    //새로운 배열 sendData 에 자식부터 부모까지 추가해준다..
    originMenuList.forEach(function (
      item: { menu_tree_sno: any },
      _index: any,
      _arr: any
    ) {
      let exist = false;
      if (item.menu_tree_sno == data.parent_menu_tree_sno) {
        if (sendData.length != 0) {
          Array.from(sendData).forEach(function (
            sendItem: { [x: string]: string },
            _index,
            _arr
          ) {
            if (sendItem["menu_tree_sno"] == data.menu_tree_sno) {
              exist = true;
            }
          });
          if (exist == false) {
            data.group_sno = groupSno;
            // if (data.menu_type == 'M') {
            //   data.row_stat = 'unchanged';
            // } else {
            //   data.row_stat = 'added';
            // }
            data.row_stat = "unchanged";
            sendData.push(data);
          }
        } else {
          sendData.push(data);
        }

        recursive(item);
      }
    });
  }

  useImperativeHandle(ref, () => ({
    onMakeData() {
      const updatedRows = popTreeGrid.CheckGridData();
      return updatedRows;
    },
    setRowData(data: any) {
      if (data) {
        console.log("tree, data 생성");
        console.log(data);
        popTreeGrid.clearRow();
        console.log("treeProvider clearRows 실행");
        popTreeGrid
          .getTreeProvider()
          .setObjectRows({ rows: data }, "rows", "", "icon");
        popTreeGrid.getTreeView().expandAll();
      } else {
        popTreeGrid.clearRow();
      }
    },
    cleanup() {
      popTreeGrid.clearRow();
    },
    confirm() {
      sendData.splice(0, sendData.length);
      checkedList.splice(0, checkedList.length);
      const rows = popTreeGrid.getTreeView().getCheckedRows(false);
      console.log("index상에서의 보이는 menulist");
      console.log(dataList);
      for (let i = 0; i < rows.length; i++) {
        const popMenuList = popTreeGrid.getJsonRow(rows[i]);
        let rowStat = "added";

        if (popMenuList.menu_type == "M") {
          rowStat = "unchanged";
        }
        originMenuList.forEach(function (
          item: { menu_tree_sno: number },
          _index: any,
          _arr: any
        ) {
          if (item.menu_tree_sno == popMenuList.menu_tree_sno) {
            checkedList.push({
              menu_name: popMenuList.menu_name,
              menu_sno: popMenuList.menu_sno,
              menu_tree_sno: popMenuList.menu_tree_sno,
              parent_menu_tree_sno: popMenuList.parent_menu_tree_sno,
              group_sno: groupSno,
              pgm_id: popMenuList.pgm_id,
              pgm_type: popMenuList.pgm_type,
              pgm_url: popMenuList.pgm_url,
              row_stat: rowStat,
              run_sno: popMenuList.run_sno,
              sort_seq: popMenuList.sort_seq,
              system_type: popMenuList.system_type,
              tree_level: popMenuList.tree_level,
              menu_type: popMenuList.menu_type,
              use_yn: "Y",
              save_yn: "Y",
              select_yn: "Y",
              print_yn: "Y",
              custom_yn: "N",
            });
          }
        });

        recursive(checkedList[i]);
      }
      // 정렬되지 않은 데이터.
      console.log(sendData);
      // 정렬할 데이터
      sendData.sort(function (
        a: { tree_level: number },
        b: { tree_level: number }
      ) {
        if (a.tree_level > b.tree_level) {
          return 1;
        }
        if (a.tree_level < b.tree_level) {
          return -1;
        }
        return 0;
      });

      return sendData;
    },
  }));

  useEffect(() => {
    //메인 트리 메뉴로부터 넘겨받은 데이터 리스트.
    console.log(dataList);
    console.log("  <<< Start Effect MenuTreeGrid.js >>> ");

    popTreeGrid = new ESTreeGrid("comm030e06poptreegrid");
    popTreeGrid.initializeGrid(Config, originRows);

    popTreeGrid.setLookup("system_type", "AA02");
    popTreeGrid.setLookup("pgm_type", "AA10");
    popTreeGrid.setLookup("menu_type", "AA13");
    popTreeGrid.setBoolColumn("use_yn");
    popTreeGrid.setBoolColumn("save_yn");
    popTreeGrid.setBoolColumn("custom_yn");
    popTreeGrid.setBoolColumn("print_yn");
    popTreeGrid.setBoolColumn("select_yn");
    popTreeGrid.setMultiSelectRows(true);
    popTreeGrid.getTreeView().displayOptions.fitStyle = GridFitStyle.NONE;
    popTreeGrid.getTreeView().sortingOptions.enabled = false;
    popTreeGrid.getTreeView().orderBy(["sort_seq"], [SortDirection.ASCENDING]);

    popTreeGrid.getTreeView().onCellClicked = function (
      _grid: any,
      clickData: IClickData
    ) {
      if (clickData.cellType === "head") return;
      const row = clickData["dataRow"];

      if (row > -1) {
        // const tempObj = popTreeGrid.getJsonRow(row);
        // onSelectMenuObj(tempObj);
      }
    };
    return () => {
      console.log("▶︎▶︎▶︎ MenuTreeGrid.tsx CleanUp");
      popTreeGrid.clearRow();
      popTreeGrid.destroy();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "600px",
        maxWidth: "700px",
        maxHeight: "600px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "490px",
          maxWidth: "700px",
          maxHeight: "600px",
          padding: "0 0 16px 0",
        }}
        id="comm030e06poptreegrid"
      ></div>
    </div>
  );
});

export default PopTreeGrid;
