/**
 * UI 개발 COMM030Q01 사용자별 메뉴 조회 typescript Convert
 *
 * @module COMM030Q01
 * 211124 pang
 */
import { useRef, useState } from "react";
import { arrayToTree } from "performant-array-to-tree";
import { Title }  from "@vntgcorp/vntg-wdk-client";

import { Search } from "./layout/100_SearchForm";
import DetailGrid from "./layout/210_DetailGrid";
import {
  MasterGridHandler,
  SearchHandler,
  DetailGridHandler,
} from "./util/Types";
import Template from "./layout/Template";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";

import MasterGrid from "./layout/200_ProgramGrid";
import { info }  from "@vntgcorp/vntg-wdk-client";
import { Notify }  from "@vntgcorp/vntg-wdk-client";

/**
 * http api POST 통신 처리 Option
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */

/**
 * COMM030Q01
 */
export default function COMM030Q01() {
  /**
   * Hook 선언
   */
  const masterGridRef = useRef<MasterGridHandler>(null);
  const detailGridRef = useRef<DetailGridHandler>(null);
  const searchRef = useRef<SearchHandler>(null);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [programDetailRows, setProgramDetailRows] = useState([]);
  const [programMasterRows, setprogramMasterRows] = useState([]);

  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const Cleanup = () => {
    /*  */
    searchRef.current.cleanup();
    masterGridRef.current.cleanup();
    detailGridRef.current.cleanup();
    info("초기화되었습니다.");
  };

  type FormProps = {
    selectBox: string;
    searchText: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = (data: FormProps) => {
    /**
       system_code: 시스템 코드, 필수      
       search_text: 프로그램 ID 및 명 , 필수
       dept_no: 부서, 생략가능
      */
    const mastersearchvalue = {
      search_text: data.searchText,
    };

    api.retriveUserList(mastersearchvalue).then((res) => {
      if (!res.data) {
        setprogramMasterRows([]);
        detailGridRef.current.cleanup();
        Notify.notfound("사용자 목록");

        return;
      }
      setprogramMasterRows(res.data);
      Notify.retrive();
    });
  };
  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    searchRef.current.submit();
  };

  const onSelectMasterRow = (data: { [x: string]: any }) => {
    const param = {
      p_user_id: data["user_id"],
    };
    api
      .retriveUserMenuAuthList(param)
      .then((response) => {
        if (response.success === true) {
          if (!response.data) {
            setProgramDetailRows([]);
            detailGridRef.current.setRowData(null);
            return;
          }
          const tempMenuTree = arrayToTree(response.data, {
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

          detailGridRef.current.setRowData(tempMenuTree);
        }
        if (response.success === false) {
          setProgramDetailRows([]);
          detailGridRef.current.setRowData(null);
        }
      })
      .catch(function (error) {
        console.log(
          "COMM030Q01/index.js Get Program Param response-> error message"
        );
        console.log(error.message);
        setProgramDetailRows([]);
        detailGridRef.current.setRowData(null);
      });

    return data;
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
            onCleanup={Cleanup}
            useSave={false}
          ></Title>
        }
        searchForm={<Search onSubmit={onSubmit} ref={searchRef}></Search>}
        leftContent={
          <MasterGrid
            ref={masterGridRef}
            title={"사용자 목록"}
            originRows={programMasterRows}
            onSelectRow={onSelectMasterRow}
          ></MasterGrid>
        }
        rightContent={
          <DetailGrid
            ref={detailGridRef}
            title="사용자 메뉴 목록"
            originRows={programDetailRows}
          ></DetailGrid>
        }
      ></Template>
    </>
  );
}
