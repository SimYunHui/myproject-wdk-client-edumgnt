/**
 * UI 개발 COMM030E02 메뉴 등록
 *
 * @module COMM030E02
 * 211209 pang
 */
import { useRef, useState } from "react";
import { arrayToTree } from "performant-array-to-tree";
import { Title } from "@vntgcorp/vntg-wdk-client";
import { Search, SearchHandler } from "./layout/100_SearchForm";
import TreeGrid, { MasterGridHandler } from "./layout/200_MenuTreeGrid";
import DetailProgramGrid, {
  DetailGridHandler,
} from "./layout/210_DetailProgramGrid";
import DetailProgramSubGrid, {
  DetailSubGridHandler,
} from "./layout/220_DetailProgramSubGrid";
import Template from "./layout/Template";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";

import PopModal from "./layout/211_PopModal";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";
import _ from "lodash";
import { MasterRowDataType, FormProps } from "./util/Types";

/**
 * COMM030E02
 */
type Handler = {
  cleanup: () => void;
};

export default function COMM030E02() {
  /**
   * Hook 선언
   */
  const masterGridRef = useRef<Handler & MasterGridHandler>(null);
  const searchRef = useRef<Handler & SearchHandler>(null);
  const prgDetailGridRef = useRef<Handler & DetailGridHandler>(null);
  const prgSubDetailGridRef = useRef<Handler & DetailSubGridHandler>(null);
  const [menuTree, setMenuTree] = useState({});
  const [programList, setProgramList] = useState([]);
  const [relationFields, setRelationFields] = useState<MasterRowDataType>();
  const [menuRelationFields, setMenuRelationFields] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [prgParamList, setPrgParamList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [groupAddData, setGroupAddData] = useState({});
  const [currentMenuInfo, setCurrentMenuInfo] = useState();

  /**
   * @method onSubmit
   * @param data
   */
  // submit callback
  // yup를 적용할 경우 callback으로 전달되지 않음
  const onSubmit = (data: FormProps) => {
    masterGridRef.current.getSystemType(data.selectBox);
    const searchvalue = {
      system_type: data.selectBox,
    };
    api.retriveTreeMenuList(searchvalue).then((res) => {
      if (!res) {
        setMenuTree({});
        setProgramList([]);
        setPrgParamList([]);
        Notify.notfound("메뉴 목록");
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
      setMenuRelationFields(res[0]);
      setRelationFields(null);
      masterGridRef.current.setRowData(tempMenuTree);
      setMenuTree(tempMenuTree);
      prgDetailGridRef.current.cleanup();
      prgSubDetailGridRef.current.cleanup();
      Notify.retrive();
    });
  };
  /**
   * 공통 기능 저장, 현재 화면 기준 개인메뉴목록(디테일그리드),개인메뉴목록-프로그램(디테일서브그리드)
   * @method onSave
   */
  const onSave = () => {
    const sendDataList: {
      cm_menu: any[];
      cm_menu_pgm: any[];
      cm_menu_param: any[];
    } = {
      cm_menu: null,
      cm_menu_pgm: null,
      cm_menu_param: null,
    };
    sendDataList.cm_menu = masterGridRef.current.toSave();
    sendDataList.cm_menu_pgm = prgDetailGridRef.current.toSave();
    sendDataList.cm_menu_param = prgSubDetailGridRef.current.toSave();
    if (
      !(
        sendDataList.cm_menu.length ||
        sendDataList.cm_menu_pgm.length ||
        sendDataList.cm_menu_param.length
      )
    ) {
      Notify.createFail();
      return;
    } else {
      api.save(sendDataList).then(() => {
        Notify.update();

        onRetrive();
        onSelectMenu(currentMenuInfo);
      });
    }
  };
  /**
   * Master Row Add 시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    prgDetailGridRef.current.cleanup();
    prgSubDetailGridRef.current.cleanup();
  };
  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const Cleanup = () => {
    /*  */
    masterGridRef.current.cleanup();
    prgDetailGridRef.current.cleanup();
    prgSubDetailGridRef.current.cleanup();
    setRelationFields(null);
    setMenuRelationFields([]);
    info("초기화되었습니다.");
  };
  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    masterGridRef.current.cleanup();
    searchRef.current.submit();
  };
  /**
   * Master Grid Row 클릭 시
   * @param obj
   * @returns
   */
  const onSelectMenu = (obj: any) => {
    prgDetailGridRef.current.cleanup();
    prgSubDetailGridRef.current.cleanup();

    if (!_.isEmpty(obj)) {
      setCurrentMenuInfo(obj);
      const param = {
        menu_sno: obj.menu_sno,
      };
      api
        .retriveProgramList(param)
        .then((res) => {
          if (!res) {
            setProgramList([]);
            setRelationFields(null);
            setMenuRelationFields([]);
            return;
          }
          setProgramList(res.data);
          setMenuRelationFields(obj);
          setRelationFields(obj);
        })
        .catch((error) => {
          console.log(error);
          alert("조회 조건을 확인해 주세요.");
        });
    }
    return obj;
  };
  /**
   * Detail Grid 선택시
   * @param data
   */
  const onSelectDetailRow = (data: MasterRowDataType) => {
    prgSubDetailGridRef.current.getProgramList(data.run_sno);
    const param = {
      run_sno: data.run_sno,
    };
    api
      .retriveProgramDetail(param)
      .then((response) => {
        if (!response) {
          setPrgParamList([]);
          return;
        }
        setPrgParamList(response.data);
        setRelationFields(data);
      })
      .catch((error) => {
        console.log(
          "COMM030E05/index.js Get Program Param response-> error message"
        );
        console.log(error.message);
        setPrgParamList([]);
      });
  };

  /**
   * 마스터-디테일 행변경시 > 임시컨펌
   * @method onRowState
   */
  const onRowState = (): number => {
    const firstCount = prgDetailGridRef.current.changeData();
    const secondCount = prgSubDetailGridRef.current.changeData();
    return firstCount + secondCount;
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

  const onSelectGroupDataValue = (data: any) => {
    setGroupAddData(data);
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
            //
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
            originRows={menuTree}
            onSelectRow={onSelectMenu}
            cleanupOther={cleanupOther}
            onRowState={onRowState}
          ></TreeGrid>
        }
        rightTopContent={
          <DetailProgramGrid
            ref={prgDetailGridRef}
            title="프로그램 목록"
            originRows={programList}
            onSelectDetailRow={onSelectDetailRow}
            relationFields={menuRelationFields}
            addGroupData={groupAddData}
            onAddGroupData={onAddGroupData}
          ></DetailProgramGrid>
        }
        rightBottomContent={
          <DetailProgramSubGrid
            ref={prgSubDetailGridRef}
            title="프로그램 Param 목록"
            originRows={prgParamList}
            relationFields={relationFields}
          ></DetailProgramSubGrid>
        }
      ></Template>
      {isOpenModal && (
        <PopModal
          onModalClose={closeAddGroupData}
          selectDataValue={onSelectGroupDataValue}
        ></PopModal>
      )}
    </>
  );
}
