/**
 * UI 개발 COMM010E01 사용자 관리 *
 * @module COMM010E01
 * seunghui
 */
import React, { SetStateAction, useRef, useState } from "react";

import Template from "./layout/Template";
import { Search } from "./layout/100_SearchForm";
import MasterGrid from "./layout/200_MasterGrid";
import FirstDetailGrid from "./layout/210_FirstDetailGrid";
import SecondDetailGrid from "./layout/220_SecondDetailGrid";
import FirstPopModal from "./layout/211_FirstPopModal";
import {
  MasterGridHandler,
  SearchHandler,
  FirstDetailGridHandler,
  SecondDetailGridHandler,
  MasterGridRowDataType,
  FirstDetailGridRowDataType,
  SecondDetailGridRowDataType,
} from "./layout/Types";
import {
  info,
  IResData as IHttpResData,
  Notify,
  Title,
  useSyncHttpCient,
  warning,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";

import SecondPopModal from "./layout/221_SecondPopModal";

export default function COMM010E01() {
  /**
   * Hook 선언
   */
  const searchRef = useRef<SearchHandler>(null);
  const gridRef = useRef<MasterGridHandler>(null);
  const firstdetailgridRef = useRef<FirstDetailGridHandler>(null);
  const seconddetailgridRef = useRef<SecondDetailGridHandler>(null);
  const [masterRows, setMasterRows] = useState([]);
  const [firstDetailRows, setFirstDetailRows] = useState([]);
  const [secondDetailRows, setSecondDetailRows] = useState([]);
  const [relationFields, setRelationFields] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModal2, setIsOpenModal2] = useState(false);
  const [addData, setAddData] = useState([]);
  const [addData2, setAddData2] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));

  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const onCleanup = () => {
    searchRef.current.cleanup();
    gridRef.current.cleanup();
    firstdetailgridRef.current.cleanup();
    seconddetailgridRef.current.cleanup();
    setRelationFields([]);
    info("초기화되었습니다.");
  };

  /**
   * 공통 기능 저장
   * @method onSave
   */
  const onSave = () => {
    let num = 0;
    const updateData: {
      cm_user: MasterGridRowDataType[];
      cm_group_users: FirstDetailGridRowDataType[];
      cm_user_role: SecondDetailGridRowDataType[];
    } = {
      cm_user: null,
      cm_group_users: null,
      cm_user_role: null,
    };
    updateData.cm_user = gridRef.current.toSave();
    updateData.cm_group_users = firstdetailgridRef.current.toSave();
    updateData.cm_user_role = seconddetailgridRef.current.toSave();

    if (
      !(
        updateData.cm_user.length ||
        updateData.cm_group_users.length ||
        updateData.cm_user_role.length
      )
    ) {
      Notify.createFail();
      return;
    } else {
      // Master Grid 중복 체크
      if (masterRows === null || masterRows.length === 0) {
        num += 0;
      } else {
        updateData.cm_user.map((row: MasterGridRowDataType) => {
          if (row.row_stat == "added") {
            masterRows.map((masterrow) => {
              if (row.user_id == masterrow.user_id) {
                num += 1;
              } else {
                num += 0;
              }
            });
          }
        });
      }

      // First Detail Grid 중복 체크
      if (updateData.cm_group_users != undefined) {
        if (firstDetailRows == null || firstDetailRows.length == 0) {
          num += 0;
        } else {
          updateData.cm_group_users.map((row: FirstDetailGridRowDataType) => {
            if (row.row_stat == "added") {
              firstDetailRows.map((detailrow) => {
                if (row.group_sno == detailrow.group_sno) {
                  num += 1;
                } else {
                  num += 0;
                }
              });
            } else {
              num += 0;
            }
          });
        }
      }

      // Second Datail 중복 체크
      if (updateData.cm_user_role != undefined) {
        if (secondDetailRows == null || secondDetailRows.length == 0) {
          num += 0;
        } else {
          updateData.cm_user_role.map((row: SecondDetailGridRowDataType) => {
            if (row.row_stat == "added") {
              secondDetailRows.map((detailrow) => {
                if (row.role_no == detailrow.role_no) {
                  num += 1;
                } else {
                  num += 0;
                }
              });
            } else {
              num += 0;
            }
          });
        }
      }

      if (num === 0) {
        api.save(updateData).then((res) => {
          if (res) {
            Notify.create();
            onRetrive();
            onRetriveFirstDetail(relationFields);
            onRetriveSecondDetail(relationFields);
          } else {
            Notify.createFail();
          }
        });
      } else {
        warning("중복되는 데이터가 있어 저장이 불가합니다.");
      }
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
     * search_text: 사용자 ID 또는 사용자 명
     * user_level: 사용자 레벨
     * use_yn: 사용 여부
     */
    const searchvalue = {
      search_text: data.search_text === "" ? "%" : data.search_text,
      user_level: data.user_level,
      use_yn: data["use_yn@@Y"] || "%",
    };

    if (!searchvalue.use_yn) {
      searchvalue.use_yn = "N";
    }

    api.retrive(searchvalue).then((res) => {
      if (!res.data && res.message) {
        setMasterRows([]);
        setFirstDetailRows([]);
        setSecondDetailRows([]);
        setRelationFields([]);
        Notify.notfound("사용자 목록");
        return;
      }
      setMasterRows(res.data);
      Notify.retrive();
    });
  };

  /**
   * First Detail Grid 조회
   * @param data
   * @returns
   */
  const onRetriveFirstDetail = (data: any[]) => {
    const param: { user_id: any } = {
      user_id: data,
    };
    api.retriveFirstDetail(param).then((res) => {
      setFirstDetailRows(res.data);
      setRelationFields(param.user_id);
    });
    return data;
  };

  /**
   * Second Detail Grid 조회
   * @param data
   * @returns
   */
  const onRetriveSecondDetail = (data: any[]) => {
    const param: { user_id: any } = {
      user_id: data,
    };
    api.retriveSecondDetail(param).then((res) => {
      setSecondDetailRows(res.data);
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
    setFirstDetailRows([]);
    setSecondDetailRows([]);
    setRelationFields([]);
    const param = {
      user_id: data.user_id,
    };
    if (param.user_id !== undefined) {
      api.retriveFirstDetail(param).then((res1) => {
        setFirstDetailRows(res1.data);
        setRelationFields(param.user_id);
      });
      api.retriveSecondDetail(param).then((res2) => {
        setSecondDetailRows(res2.data);
        setRelationFields(param.user_id);
      });
    } else {
      setRelationFields(param.user_id);
    }
    return data;
  };

  /**
   * 마스터-디테일 행변경시, 변경데이터 확인
   * @method onRowState
   */
  const onRowState = (): number => {
    const firstCount = firstdetailgridRef.current.changeData();
    const secondCount = seconddetailgridRef.current.changeData();
    return firstCount + secondCount;
  };
  /**
   * Master Row Add 시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    firstdetailgridRef.current.cleanup();
    seconddetailgridRef.current.cleanup();
  };

  /**
   * First Pop Modal 관런
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

  /**
   * Second Pop Modal 관련
   */
  const onAddData2 = () => {
    if (!isOpenModal2) {
      setIsOpenModal2(true);
    }
  };

  const closeAddData2 = () => {
    if (isOpenModal2) {
      setIsOpenModal2(false);
    }
  };

  const onSelectDataValue2 = (data: React.SetStateAction<any[]>) => {
    setAddData2(data);
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
        leftContent={
          <MasterGrid
            title="사용자 목록"
            originRows={masterRows}
            onSelectRow={onSelectMasterRow}
            cleanupOther={cleanupOther}
            onRowState={onRowState}
            ref={gridRef}
          />
        }
        rightTopContent={
          <FirstDetailGrid
            title="사용자별 그룹 목록"
            originRows={firstDetailRows}
            relationFields={relationFields}
            addData={addData}
            onAddData={onAddData}
            ref={firstdetailgridRef}
          />
        }
        rightBottomContent={
          <SecondDetailGrid
            title="사용자별 Role 목록"
            originRows={secondDetailRows}
            relationFields={relationFields}
            addData={addData2}
            onAddData={onAddData2}
            ref={seconddetailgridRef}
          />
        }
      ></Template>
      {isOpenModal && (
        <FirstPopModal
          onModalClose={closeAddData}
          selectDataValue={onSelectDataValue}
        ></FirstPopModal>
      )}
      {isOpenModal2 && (
        <SecondPopModal
          onModalClose={closeAddData2}
          selectDataValue={onSelectDataValue2}
        ></SecondPopModal>
      )}
    </>
  );
}
