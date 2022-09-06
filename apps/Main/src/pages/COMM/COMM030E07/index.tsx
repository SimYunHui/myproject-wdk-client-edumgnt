/**
 * UI 개발 COMM030E07 개인 메뉴 등록
 *
 * @module COMM030E07
 * 211124 pang
 */
import _ from "lodash";
import { arrayToTree } from "performant-array-to-tree";
import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";
import { Title } from "@vntgcorp/vntg-wdk-client";
import { userInfoGlobalState } from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";
import { Search } from "./layout/100_SearchForm";
import TreeGrid from "./layout/200_MenuTreeGrid";
import DetailGrid from "./layout/210_DetailGrid";
import DetailSubGrid from "./layout/220_DetailSubGrid";
import Template from "./layout/Template";
import {
  DetailGridHandler,
  DetailSubGridHandler,
  MasterGridHandler,
  SearchHandler,
} from "./layout/Types";

/**
 * COMM030E07
 */

export default function COMM030E07() {
  /**
   * Hook 선언
   */
  const masterGridRef = useRef<MasterGridHandler>(null);
  const detailGridRef = useRef<DetailGridHandler>(null);
  const detailSubGridRef = useRef<DetailSubGridHandler>(null);
  const searchRef = useRef<SearchHandler>(null);

  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [menuTreeRows, setmenuTreeRows] = useState([]);
  const [programDetailRows, setProgramDetailRows] = useState([]);
  const [programDetailSubList, setProgramDetailSubList] = useState([]);

  const userInfo = useRecoilValue(userInfoGlobalState);

  // useEffect(() => {
  //   onRetrive();
  // }, []);
  /**
   * 공통 기능 저장, 현재 화면 기준 개인메뉴목록(디테일그리드),개인메뉴목록-프로그램(디테일서브그리드)
   * @method onSave
   */
  const onSave = () => {
    const sendDataList: { cm_user_menu: any; cm_user_menu_pgm: any } = {
      cm_user_menu: null,
      cm_user_menu_pgm: null,
    };
    sendDataList.cm_user_menu = detailGridRef.current.toSave();
    sendDataList.cm_user_menu_pgm = detailSubGridRef.current.toSave();
    if (
      !(
        sendDataList.cm_user_menu.length || sendDataList.cm_user_menu_pgm.length
      )
    ) {
      Notify.createFail();
      return;
    } else {
      console.log(sendDataList);
      api.saveUserMenu(sendDataList).then((_res) => {
        Notify.update();
        onRetrive();
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
    detailGridRef.current.cleanup();
    detailSubGridRef.current.cleanup();

    info("초기화되었습니다.");
  };

  type FormProps = {
    selectBox: string;
    titleText: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  // submit callback
  // yup를 적용할 경우 callback으로 전달되지 않음
  const onSubmit = (data: FormProps) => {
    const searchvalue = {
      p_system_type: data.selectBox,
    };
    api.retriveTreeMenuList(searchvalue).then((res) => {
      if (!res) {
        Notify.notfound("그룹 목록");
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
    });
    const param = {
      user_id: userInfo.user_id,
    };
    api.retriveUserMenuAuthList(param).then((res) => {
      if (!res) {
        Notify.notfound("개인 메뉴 목록");
        return;
      }
      const tempMenuTree = arrayToTree(res, {
        id: "menu_sno",
        parentId: "parent_menu_sno",
        childrenField: "rows",
        dataField: null,
        rootParentIds: {
          0: true,
        },
      });
      tempMenuTree.map((menuItem) => {
        menuItem.icon = "0";
      });
      let maxMenuSno = 0;
      tempMenuTree.forEach((_curr, i) => {
        if (maxMenuSno < tempMenuTree[i].menu_sno) {
          maxMenuSno = tempMenuTree[i].menu_sno;
        }
      });
      // detailGridRef.current.getMaxMenuSno(maxMenuSno);
      detailGridRef.current.setRowData(tempMenuTree);
      // setMenuTree(tempMenuTree);
      setProgramDetailRows(tempMenuTree);
      Notify.retrive();
    });
  };
  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    masterGridRef.current.cleanup();
    detailGridRef.current.cleanup();
    detailSubGridRef.current.cleanup();
    searchRef.current.submit();

    //기본값으로 null 전송 처리.
    detailSubGridRef.current.getFocusedMenuSno(null);
    detailSubGridRef.current.getProgramList(null);
  };

  const onSelectMenu = (obj: { user_id: string }) => {
    obj.user_id = userInfo.user_id;
    // obj.user_id = 'sheadmin';
    detailSubGridRef.current.getProgramList(obj);
  };
  const onSelectUserMenu = (obj: { menu_sno: any }) => {
    if (!_.isEmpty(obj)) {
      detailSubGridRef.current.getFocusedMenuSno(obj.menu_sno);
      const param = {
        // user_id: UserService.getUser().id,
        user_id: userInfo.user_id,
        menu_sno: obj.menu_sno,
      };

      api
        .retriveUserProgramList(param)
        .then((response) => {
          if (response.success === true) {
            if (!response.data) {
              setProgramDetailSubList([]);
              return;
            }
            setProgramDetailSubList(response.data);
          }
          if (response.success === false) {
            setProgramDetailSubList([]);
          }
        })
        .catch(function (error) {
          console.log(
            "COMM030E07/index.js Get Program Param response-> error message"
          );
          console.log(error.message);
          setProgramDetailSubList([]);
        });
    }
    return obj;
  };

  /**
   * 마스터-디테일 행변경시, 변경데이터 확인
   * @method onRowState
   */
  const onRowState = (): number => {
    const detailCount = detailSubGridRef.current.changeData();
    return detailCount;
  };

  /**
   * 마스터 행 변경시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    detailSubGridRef.current.cleanup();
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
            title="시스템 메뉴 목록"
            originRows={menuTreeRows}
            onSelectMenuObj={onSelectMenu}
          ></TreeGrid>
        }
        rightTopContent={
          <DetailGrid
            ref={detailGridRef}
            title="개인 메뉴 목록"
            originRows={programDetailRows}
            onSelectRow={onSelectUserMenu}
            onRowState={onRowState}
            cleanupOther={cleanupOther}
          ></DetailGrid>
        }
        rightBottomContent={
          <DetailSubGrid
            ref={detailSubGridRef}
            title="개인 메뉴 프로그램 목록 "
            originRows={programDetailSubList}
          ></DetailSubGrid>
        }
      ></Template>
    </>
  );
}
