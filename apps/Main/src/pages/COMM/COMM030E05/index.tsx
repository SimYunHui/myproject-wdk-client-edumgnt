/**
 * UI 개발 COMM030E05 메뉴권한 등록
 *
 * @module COMM030E05
 * 211207 pang
 */
import { useRef, useState } from "react";
import { arrayToTree } from "performant-array-to-tree";
import { Title } from "@vntgcorp/vntg-wdk-client";
import { Search } from "./layout/100_SearchForm";
import TreeGrid from "./layout/200_MenuTreeGrid";
import DetailGroupGrid from "./layout/210_DetailGroupGrid";
import DetailUserGrid from "./layout/220_DetailUserGrid";
import {
  MasterGridHandler,
  DetailGroupGridHandler,
  DetailUserGridHandler,
  SearchHandler,
} from "./util/Types";

import Template from "./layout/Template";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";

import PopModal from "./layout/211_PopModal";
import PopSubModal from "./layout/221_PopModal";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import _ from "lodash";
import { info } from "@vntgcorp/vntg-wdk-client";
/**
 * http api POST 통신 처리 Option
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */

/**
 * COMM030E05
 */

export default function COMM030E05() {
  /**
   * Hook 선언
   */
  const masterGridRef = useRef<MasterGridHandler>(null);
  const groupDetailGridRef = useRef<DetailGroupGridHandler>(null);
  const userDetailGridRef = useRef<DetailUserGridHandler>(null);
  const searchRef = useRef<SearchHandler>(null);

  const [groupList, setGroupList] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [menuTreeRows, setmenuTreeRows] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenSubModal, setIsOpenSubModal] = useState(false);
  const [addGroupData, setAddGroupData] = useState({});
  const [addUserData, setAddUserData] = useState({});
  const [currentMenuInfo, setCurrentMenuInfo] = useState<any>([]);

  type FormProps = {
    selectBox: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = (data: FormProps) => {
    const searchvalue = {
      p_system_type: data.selectBox,
    };
    api.retriveTreeMenuList(searchvalue).then((res) => {
      if (!res) {
        setGroupList([]);
        Notify.notfound("메뉴 목록");
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
      masterGridRef.current.setRowData(tempMenuTree);
      setmenuTreeRows(tempMenuTree);
      Notify.retrive();
    });
  };
  /**
   * 공통 기능 저장,
   * 현재 화면 기준 개인메뉴목록(디테일그리드),개인메뉴목록-프로그램(디테일서브그리드)
   * @method onSave
   */
  const onSave = () => {
    const sendDataList: {
      cm_group_auth: any[];
      cm_user_auth: any[];
    } = {
      cm_group_auth: null,
      cm_user_auth: null,
    };
    sendDataList.cm_group_auth = groupDetailGridRef.current.toSave();
    sendDataList.cm_user_auth = userDetailGridRef.current.toSave();
    if (
      !(sendDataList.cm_group_auth.length || sendDataList.cm_user_auth.length)
    ) {
      Notify.createFail();
      return;
    } else {
      api.save(sendDataList).then(() => {
        onSelectMenu(currentMenuInfo);

        Notify.update();
        Notify.retrive();
      });
    }
  };
  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const Cleanup = () => {
    /*  */
    searchRef.current.cleanup();
    masterGridRef.current.cleanup();
    groupDetailGridRef.current.cleanup();
    userDetailGridRef.current.cleanup();
    groupDetailGridRef.current.getMenuData(undefined);
    userDetailGridRef.current.getProgramList(undefined);
    info("초기화되었습니다.");
  };
  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    masterGridRef.current.cleanup();
    groupDetailGridRef.current.cleanup();
    userDetailGridRef.current.cleanup();
    searchRef.current.submit();
  };
  const onSelectMenu = (obj: any) => {
    if (!_.isEmpty(obj)) {
      setCurrentMenuInfo(obj);
      groupDetailGridRef.current.getMenuData(obj);
      userDetailGridRef.current.getProgramList(obj.run_sno);
      const param = {
        run_sno: obj.run_sno,
      };

      api
        .retriveGroupAuthList(param)
        .then((res) => {
          if (!res) {
            setGroupList([]);
            return;
          }
          setGroupList(res.data);
        })
        .catch((error) => {
          console.log(error);
          alert("조회 조건을 확인해 주세요.");
        });

      api
        .retriveUserAuthList(param)
        .then((response) => {
          if (!response) {
            setUserList([]);
            return;
          }

          setUserList(response.data);
        })
        .catch((error) => {
          console.log(
            "COMM030E05/index.js Get Program Param response-> error message"
          );
          console.log(error.message);
          setUserList([]);
        });
    }
    return obj;
  };
  /**
   * 마스터-디테일 행변경시, 변경데이터 확인
   * @method onRowState
   */
  const onRowState = (): number => {
    const firstCount = groupDetailGridRef.current.changeData();
    const secondCount = userDetailGridRef.current.changeData();
    return firstCount + secondCount;
  };

  /**
   * 마스터 행 변경시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    groupDetailGridRef.current.cleanup();
    userDetailGridRef.current.cleanup();
  };

  const onAddGroupData = () => {
    if (!isOpenModal) {
      setIsOpenModal(true);
    }
  };
  const closeAddGroupData = () => {
    if (isOpenModal) {
      setIsOpenModal(false);
    }
  };
  const onAddUserData = () => {
    if (!isOpenSubModal) {
      setIsOpenSubModal(true);
    }
  };
  const closeAddUserData = () => {
    if (isOpenSubModal) {
      setIsOpenSubModal(false);
    }
  };
  const onSelectGroupDataValue = (data: any) => {
    setAddGroupData(data);
  };
  const onSelectUserDataValue = (data: any) => {
    setAddUserData(data);
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
        leftContent={
          <TreeGrid
            ref={masterGridRef}
            title="메뉴 목록"
            originRows={menuTreeRows}
            onSelectRow={onSelectMenu}
            onRowState={onRowState}
            cleanupOther={cleanupOther}
          ></TreeGrid>
        }
        rightTopContent={
          <DetailGroupGrid
            ref={groupDetailGridRef}
            title="그룹 권한 목록"
            originRows={groupList}
            addGroupData={addGroupData}
            onAddGroupData={onAddGroupData}
          ></DetailGroupGrid>
        }
        rightBottomContent={
          <DetailUserGrid
            ref={userDetailGridRef}
            title="사용자 권한 목록"
            originRows={userList}
            addUserData={addUserData}
            onAddUserData={onAddUserData}
          ></DetailUserGrid>
        }
      ></Template>
      {isOpenModal && (
        <PopModal
          onModalClose={closeAddGroupData}
          selectDataValue={onSelectGroupDataValue}
        ></PopModal>
      )}
      {isOpenSubModal && (
        <PopSubModal
          onModalClose={closeAddUserData}
          selectDataValue={onSelectUserDataValue}
        ></PopSubModal>
      )}
    </>
  );
}
