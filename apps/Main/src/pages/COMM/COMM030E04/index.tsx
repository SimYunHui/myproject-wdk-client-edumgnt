/**
 * UI 개발 COMM030E04 사용자 Role 등록 *
 * @module COMM030E04
 * 211123 seunghui
 */
import React, { useRef, useState } from "react";
import { Title } from "@vntgcorp/vntg-wdk-client";
import Template from "./layout/Template";
import { Search } from "./layout/100_SearchForm";
import MasterGrid from "./layout/200_MasterGrid";
import DetailGrid from "./layout/210_DetailGrid";
import {
  MasterGridHandler,
  SearchHandler,
  DetailGridHandler,
  DetailGridRowDataType,
} from "./layout/Types";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";

import PopModal from "./layout/211_PopModal";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";

export default function COMM030E04() {
  /**
   * Hook 선언
   */
  const searchRef = useRef<SearchHandler>();
  const gridRef = useRef<MasterGridHandler>();
  const detailgridRef = useRef<DetailGridHandler>();
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
    const updateData: { cm_user_role: DetailGridRowDataType[] } = {
      cm_user_role: null,
    };
    updateData.cm_user_role = detailgridRef.current.toSave();
    if (!updateData.cm_user_role.length) {
      Notify.createFail();
      return;
    } else {
      api.save(updateData).then(() => {
        Notify.create();
        onRetrive();
        onRetriveDetail(relationFields);
      });
    }
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
    search_text: string;
    user_level: string;
    use_yn: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = (data: FormProps | any) => {
    /**
     * search_text: 사용자ID 또는 사용자명
     * user_level: 사용자 레벨
     * use_yn: 사용 여부
     */
    const searchvalue = {
      search_text: data.search_text === "" ? "%" : data.search_text,
      user_level: data.user_level,
      use_yn: data["use_yn@@Y"] || "%",
    };

    if (searchvalue.user_level === "") {
      searchvalue.user_level = "%";
    }
    if (!searchvalue.use_yn) {
      searchvalue.use_yn = "N";
    }

    api.retrive(searchvalue).then((res) => {
      if (!res.data) {
        Notify.notfound("사용자 목록");
        setMasterRows([]);
        setDetailRows([]);
        setRelationFields([]);
        return;
      }
      setMasterRows(res.data);
      Notify.retrive();
    });
  };

  /**
   * Detail Grid 조회
   * @param data
   * @returns
   */
  const onRetriveDetail = (data: any[]) => {
    const param = {
      user_id: data,
    };
    api.retriveDetail(param).then((res) => {
      setDetailRows(res.data);
      setRelationFields(param.user_id);
    });
    return data;
  };

  /**
   * Master Grid Row 클릭 시
   * @param data
   * @returns
   */
  const onSelectMasterRow = (data: { user_id: any }) => {
    const param = {
      user_id: data.user_id,
    };
    api.retriveDetail(param).then((res) => {
      setDetailRows(res.data);
      setRelationFields(param.user_id);
    });
    return data;
  };

  /**
   * 마스터-디테일 행변경시, 변경데이터 확인
   * @method onRowState
   */
  const onRowState = (): number => {
    const detailCount = detailgridRef.current.changeData();
    return detailCount;
  };

  /**
   * 마스터 행 변경시 나머지 Grid 초기화
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
       * @param {function} onCleanup 공통 초기화버튼
       * @param {function} onSave 공통 저장버튼
       * @param {function} onRetrive 공통 조회버튼
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
        leftContent={
          <MasterGrid
            title="사용자 목록"
            originRows={masterRows}
            onSelectRow={onSelectMasterRow}
            onRowState={onRowState}
            cleanupOther={cleanupOther}
            ref={gridRef}
          />
        }
        rightContent={
          <DetailGrid
            title="사용자별 Role 목록"
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
