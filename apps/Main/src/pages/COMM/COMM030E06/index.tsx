/**
 * UI 개발 COMM030E06 그룹 기준 메뉴 권한 등록
 *
 * @module COMM030E02
 * 211209 pang
 */
import { arrayToTree } from "performant-array-to-tree";
import { useRef, useState } from "react";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";
import { Title } from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";
import { Search } from "./layout/100_SearchForm";
import MasterGrid from "./layout/200_MasterGrid";
import DetailGrid from "./layout/210_DetailGrid";
import TreeGrid from "./layout/220_MenuTreeGrid";
import PopModal from "./layout/221_PopModal";
import Template from "./layout/Template";
import {
  DetailGridHandler,
  DetailTreeGridHandler,
  DetailTreeGridRowDataType,
  MasterGridHandler,
  SearchHandler,
} from "./layout/Types";

/**groupSno
 * COMM030E06
 */

export default function COMM030E06() {
  /**
   * Hook 선언
   */
  const masterGridRef = useRef<MasterGridHandler>(null);
  const detailTreeGridRef = useRef<DetailTreeGridHandler>(null);
  const detailGridRef = useRef<DetailGridHandler>(null);
  const searchRef = useRef<SearchHandler>(null);
  const [menuTree, setMenuTree] = useState({});
  const [menuList, setMenuList] = useState<DetailTreeGridRowDataType[]>();
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [masterRows, setMasterRows] = useState([]);
  const [detailRows, setDetailRows] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [treeMenuAddData, setTreeMenuAddData] = useState({});
  const [menuDataList, setMenuDataList] = useState({});
  const [groupSno, setGroupSno] = useState<number>();

  type FormProps = {
    search_text: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = (data: FormProps) => {
    const searchvalue = {
      group_name: data.search_text,
    };
    if (!searchvalue.group_name) {
      searchvalue.group_name = "%";
    }
    api.retriveGroupList(searchvalue).then((res) => {
      if (res.data === null) {
        setMenuTree({});
        setMasterRows([]);
        setDetailRows([]);
        onSelectGroup(null);
        Notify.notfound("그룹 목록");
        return;
      }
      setMasterRows(res.data);

      Notify.retrive();
    });
  };
  /**
   * 공통 기능 저장, 현재 화면 기준 개인메뉴목록(디테일그리드),개인메뉴목록-프로그램(디테일서브그리드)
   * @method onSave
   */
  const onSave = () => {
    const sendDataList: { cm_group_auth: any } = {
      cm_group_auth: null,
    };

    sendDataList.cm_group_auth = detailTreeGridRef.current.toSave();
    if (!sendDataList.cm_group_auth.length) {
      Notify.createFail();
      return;
    } else {
      sendDataList.cm_group_auth.forEach(function (
        item: { menu_type: string; row_stat: string },
        _index: any
      ) {
        if (item.menu_type == "M") {
          item.row_stat = "unchanged";
        }
      });
      api.save(sendDataList).then((_res) => {
        setTreeMenuAddData({});
        onRetrive();
        Notify.update();
      });
    }
  };
  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const Cleanup = () => {
    /*  */
    masterGridRef.current.cleanup();
    detailTreeGridRef.current.cleanup();
    detailGridRef.current.cleanup();
    detailTreeGridRef.current.getProgramList(undefined);
    info("초기화되었습니다.");
  };
  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    searchRef.current.submit();
  };
  const onSelectMenu = (_obj: any) => {
    // console.log('트리메뉴 클릭 호출');
  };
  const onSelectGroup = (data: any) => {
    if (data === null) {
      setMenuList([]);
      detailTreeGridRef.current.setRowData(null);
    } else {
      detailTreeGridRef.current.getProgramList(data.group_sno);
      const param = {
        group_sno: data.group_sno,
      };
      setGroupSno(data.group_sno);
      api
        .retriveGroupUserList(param)
        .then((response) => {
          if (!response) {
            setDetailRows([]);
            return;
          }
          setDetailRows(response.data);
        })
        .catch((error) => {
          console.log(error.message);
          setDetailRows([]);
        });
      retriveMenuTree(param);
      return data;
    }
  };
  const retriveMenuTree = (param: any) => {
    api.retriveTreeMenuList(param).then((res) => {
      if (!res) {
        setMenuList([]);
        detailTreeGridRef.current.setRowData(null);
        return;
      }
      if (!res) {
        setMenuTree({});
        return;
      }
      const tempMenuTree = arrayToTree(res, {
        id: "menu_tree_sno",
        parentId: "parent_menu_tree_sno",
        childrenField: "rows",
        dataField: null,
        rootParentIds: {
          0: true,
        },
      });
      tempMenuTree.map((menuItem) => {
        menuItem.icon = "0";
      });
      detailTreeGridRef.current.setRowData(tempMenuTree);
      setMenuList(tempMenuTree as DetailTreeGridRowDataType[] | any);
    });
  };

  /**
   * 마스터-디테일 행변경시, 변경데이터 확인
   * @method onRowState
   */
  const onRowState = (): number => {
    const firstCount = detailTreeGridRef.current.changeData();
    const secondCount = detailGridRef.current.changeData();
    return firstCount + secondCount;
  };

  /**
   * 마스터 행 변경시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    detailTreeGridRef.current.cleanup();
    detailGridRef.current.cleanup();
  };

  const onAddMenuData = (menuTreeData: any) => {
    if (!isOpenModal) {
      setMenuDataList(menuTreeData);
      setIsOpenModal(true);
    }
  };
  const closeAddGroupData = () => {
    if (isOpenModal) {
      setIsOpenModal(false);
      // setTreeMenuAddData({});
    }
  };

  const onSelectMenuDataValue = (data: any) => {
    setTreeMenuAddData(data);
  };
  const onRefreshState = () => {
    setTreeMenuAddData({});
  };
  return (
    <>
      {/**
       * 공통 Title Component
       * @param {function} onSave 공통 저장버튼
       * @param {function} onRetrive 공통 조회버튼
       * @param {function} onCleanup 공통 초기화버튼
       */}
      <Template
        title={
          <Title
            onRetrive={onRetrive}
            onSave={onSave}
            onCleanup={Cleanup}
          ></Title>
        }
        searchForm={<Search onSubmit={onSubmit} ref={searchRef}></Search>}
        leftTopContent={
          <MasterGrid
            ref={masterGridRef}
            title="그룹 정보"
            originRows={masterRows}
            onSelectRow={onSelectGroup}
            onRowState={onRowState}
            cleanupOther={cleanupOther}
          ></MasterGrid>
        }
        leftBottomContent={
          <DetailGrid
            ref={detailGridRef}
            title="그룹별 사용자 정보"
            originRows={detailRows}
          ></DetailGrid>
        }
        rightContent={
          <TreeGrid
            ref={detailTreeGridRef}
            title="메뉴 목록"
            originRows={menuList}
            onSelectRow={onSelectMenu}
            addMenuData={treeMenuAddData}
            onAddMenuData={onAddMenuData}
            refreshState={onRefreshState}
          ></TreeGrid>
        }
      ></Template>
      {isOpenModal && (
        <PopModal
          onModalClose={closeAddGroupData}
          selectDataValue={onSelectMenuDataValue}
          dataList={menuDataList}
          groupSno={groupSno}
        ></PopModal>
      )}
    </>
  );
}
