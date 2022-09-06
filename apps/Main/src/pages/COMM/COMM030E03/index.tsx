/**
 * UI 개발 COMM030E03 Role 등록 *
 * @module COMM030E03
 * 211123 seunghui
 */
import React, { useRef, useState } from "react";
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
import PopModal from "./layout/211_PopModal";
import Template from "./layout/Template";
import {
  DetailGridHandler,
  DetailGridRowDataType,
  MasterGridHandler,
  MasterGridRowDataType,
  SearchHandler,
} from "./layout/Types";

export default function COMM030E03() {
  /**
   * Hook 선언
   */
  const searchRef = useRef<SearchHandler>(null);
  const gridRef = useRef<MasterGridHandler>(null);
  const detailgridRef = useRef<DetailGridHandler>(null);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [masterRows, setMasterRows] = useState([]);
  const [detailRows, setDetailRows] = useState([]);
  const [relationFields, setRelationFields] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [addData, setAddData] = useState([]);

  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const onCleanup = () => {
    searchRef.current.cleanup();
    gridRef.current.cleanup();
    detailgridRef.current.cleanup();
    setRelationFields([]);
    info("초기화되었습니다.");
  };

  /**
   * 공통 기능 저장
   * @method onSave
   */
  const onSave = () => {
    const updateData: {
      cm_role: MasterGridRowDataType[];
      cm_user_role: DetailGridRowDataType[];
    } = {
      cm_role: null,
      cm_user_role: null,
    };
    updateData.cm_role = gridRef.current.toSave();
    updateData.cm_user_role = detailgridRef.current.toSave();
    if (!(updateData.cm_role.length || updateData.cm_user_role.length)) {
      Notify.createFail();
      return;
    }
    api.save(updateData).then(() => {
      Notify.create();
      onRetrive();
      onRetriveDetail(relationFields);
    });
  };

  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    searchRef.current.submit();
  };

  /**
   *
   */
  type FormProps = {
    [x: string]: String;
    // search_text: string;
    // use_yn: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = (data: FormProps) => {
    // console.log('index Page onSubmit data 🎃>> ', data);
    /**
     * search_text: Role 명
     * use_yn: 사용 여부
     */
    const searchvalue = {
      search_text: data.search_text === "" ? "%" : data.search_text,
      use_yn: data["use_yn@@Y"] || "%",
    };

    if (!searchvalue.use_yn) {
      searchvalue.use_yn = "N";
    }

    api.retrive(searchvalue).then((res) => {
      if (!res.data) {
        setMasterRows([]);
        setDetailRows([]);
        setRelationFields([]);
        Notify.notfound("Role 목록");
        return;
      }
      setMasterRows(res.data);
      Notify.retrive();
    });
  };

  /**
   *  저장 후 Detail Grid 조회
   * @param data
   * @returns
   */
  const onRetriveDetail = (data: any[]) => {
    const param = {
      role_no: data,
    };
    api.retriveDetail(param).then((res) => {
      setDetailRows(res.data);
      setRelationFields(param.role_no);
    });
    return data;
  };

  /**
   *  Master Grid Row 선택 시 Detail Grid 조회
   * @param data
   * @returns
   */
  const onSelectMasterRow = (data: { role_no: any }) => {
    setDetailRows([]);
    setRelationFields([]);
    const param = {
      role_no: data.role_no,
    };
    if (param.role_no !== undefined) {
      api.retriveDetail(param).then((res) => {
        setDetailRows(res.data);
        setRelationFields(param.role_no);
      });
    } else {
      setRelationFields(param.role_no);
    }
    return data;
  };

  /**
   * 마스터-디테일 행변경시 > 임시컨펌
   * @method onRowState
   */
  const onRowState = () => {
    const detailCount = detailgridRef.current.changeData();
    return detailCount;
  };

  /**
   * Master Row Add 시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    detailgridRef.current.cleanup();
  };

  /**
   * Pop Modal 관련
   */
  const onAddData = () => {
    if (!isOpenModal) {
      setIsOpenModal(true);
    }
  };

  const closeAddData = () => {
    if (isOpenModal) {
      setIsOpenModal(false);
    }
  };

  const onSelectDataValue = (data: React.SetStateAction<any[]>) => {
    setAddData(data);
  };

  return (
    <>
      {/**  공통 Title Component
       * @param {function} onSave 공통 저장버튼
       * @param {function} onRetrive 공통 조회버튼
       * @param {function} onCleanup 공통 초기화버튼
       */}

      <Template
        title={
          <Title
            onCleanup={onCleanup}
            onSave={onSave}
            onRetrive={onRetrive}
          ></Title>
        }
        searchForm={<Search onSubmit={onSubmit} ref={searchRef} />}
        topContent={
          <MasterGrid
            title="Role 목록"
            originRows={masterRows}
            onSelectRow={onSelectMasterRow}
            cleanupOther={cleanupOther}
            onRowState={onRowState}
            ref={gridRef}
          />
        }
        bottomContent={
          <DetailGrid
            title="Role 별 사용자 목록"
            originRows={detailRows}
            relationFields={relationFields}
            addData={addData}
            onAddData={onAddData}
            ref={detailgridRef}
          />
        }
      ></Template>
      {isOpenModal && (
        <PopModal
          onModalClose={closeAddData}
          selectDataValue={onSelectDataValue}
        ></PopModal>
      )}
    </>
  );
}
