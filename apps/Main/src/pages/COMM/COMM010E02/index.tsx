/**
 * UI 개발 COMM010E02 그룹 등록 *
 * @module COMM010E02
 * seunghui
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
  MasterGridRowDataType,
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
export default function COMM010E02() {
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
      cm_group: MasterGridRowDataType[];
      cm_group_users: DetailGridRowDataType[];
    } = {
      cm_group: null,
      cm_group_users: null,
    };
    updateData.cm_group = gridRef.current.toSave();
    updateData.cm_group_users = detailgridRef.current.toSave();

    if (!(updateData.cm_group.length || updateData.cm_group_users.length)) {
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
    use_yn: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = (data: FormProps | any) => {
    /**
     * search_text: 그룹명
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
      if (!res.data && res.message) {
        setMasterRows([]);
        setDetailRows(null);
        setRelationFields([]);
        Notify.notfound("그룹 목록");
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
  const onRetriveDetail = (data: any) => {
    const param = {
      group_sno: data,
    };
    api.retriveDetail(param).then((res) => {
      if (!res.data) {
        setDetailRows(null);
      }
      setDetailRows(res.data);
      setRelationFields(param.group_sno);
    });
    return data;
  };

  /**
   * Master Grid Row 클릭 시
   * @param data
   * @returns
   */
  const onSelectMasterRow = (data: { group_sno: any }) => {
    setDetailRows(null);
    setRelationFields([]);
    const param = {
      group_sno: data.group_sno,
    };
    if (param.group_sno !== undefined) {
      api.retriveDetail(param).then((res) => {
        setDetailRows(res.data);
        setRelationFields(param.group_sno);
      });
    } else {
      setRelationFields(param.group_sno);
    }
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
       * @param {function} onCleanup 공통 초기화버튼
       * @param {function} onSave 공통 저장버튼
       * @param {function} onRetrive 공통 조회버튼
       */}
      <Template
        title={
          <Title onSave={onSave} onRetrive={onRetrive} onCleanup={onCleanup} />
        }
        searchForm={<Search onSubmit={onSubmit} ref={searchRef} />}
        topContent={
          <MasterGrid
            title="그룹 목록"
            originRows={masterRows}
            onSelectRow={onSelectMasterRow}
            cleanupOther={cleanupOther}
            onRowState={onRowState}
            ref={gridRef}
          />
        }
        bottomContent={
          <DetailGrid
            title="그룹별 사용자 목록"
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
          detailRows={detailRows}
        ></PopModal>
      )}
    </>
  );
}
