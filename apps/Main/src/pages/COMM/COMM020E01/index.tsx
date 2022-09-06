/**
 * UI 개발 COMM020E01 공통코드 관리 *
 * @module COMM020E01
 * seunghui
 */
import { useRef, useState } from "react";
import { Title } from "@vntgcorp/vntg-wdk-client";
import { Search } from "./layout/100_SearchForm";
import Template from "./layout/Template";
import MasterGrid, { getGridValues } from "./layout/200_MasterGrid";
import DetailGrid, { getDetailGridValues } from "./layout/210_DetailGrid";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { error, warning } from "@vntgcorp/vntg-wdk-client";
import {
  DetailGridHandler,
  MasterGridHandler,
  SearchHandler,
} from "./util/Types";

export default function COMM020E01() {
  const searchRef = useRef<SearchHandler>(null);
  const gridRef = useRef<MasterGridHandler>(null);
  const detailgridRef = useRef<DetailGridHandler>(null);
  const [masterRows, setMasterRows] = useState([]);
  const [detailRows, setDetailRows] = useState([]);
  const [relationFields, setRelationFields] = useState([]);
  const [, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  // 수정 여부 체크
  const [isChanged, setIsChanged] = useState(false);

  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const onCleanup = () => {
    searchRef.current.cleanup();
    gridRef.current.cleanup();
    detailgridRef.current.cleanup();
    setRelationFields([]);
    setIsChanged(false);
  };

  /**
   * 공통 기능 저장
   * @method onSave
   */
  const onSave = () => {
    if (!isChanged) {
      return Notify.createFail();
    }

    const _cm_code_master = gridRef.current.toSave();
    const cm_code_master = getGridValues();
    const _cm_code_detail = detailgridRef.current.toSave();
    const cm_code_detail = getDetailGridValues();

    if (cm_code_master.length === 0 && _cm_code_master.length !== 0) {
      // validation 오류
      console.log(
        "cm_code_master.length === 0 && _cm_code_master.length !== 0"
      );
      return Notify.createFail();
    }

    if (cm_code_detail.length === 0 && _cm_code_detail.length !== 0) {
      // validation 오류
      console.log(
        "cm_code_detail.length === 0 && _cm_code_detail.length !== 0"
      );
      return Notify.createFail();
    }

    if (cm_code_master.length === 0 && cm_code_detail.length === 0) {
      // 수정된 데이터 없음
      console.log("cm_code_master.length === 0 && cm_code_detail.length === 0");
      return Notify.createFail();
    }

    const updateData = {
      cm_code_master: cm_code_master,
      cm_code_detail: cm_code_detail,
    };

    let num = 0;

    if (
      !(updateData.cm_code_master.length || updateData.cm_code_detail.length)
    ) {
      Notify.createFail();
      return;
    } else {
      // Master Grid 중복 체크
      if (masterRows === null || masterRows.length === 0) {
        num += 0;
      } else {
        updateData.cm_code_master.map((row) => {
          type oKey = keyof typeof row;
          if (row["row_stat" as oKey] == "added") {
            masterRows.map((masterrow) => {
              if (
                row.cm_code_type_id.toUpperCase() ==
                masterrow.cm_code_type_id.toUpperCase()
              ) {
                num += 1;
              } else {
                num += 0;
              }
            });
          }
        });
      }

      // Detail Grid 중복 체크
      if (updateData.cm_code_detail != undefined) {
        if (detailRows == null || detailRows.length == 0) {
          num += 0;
        } else {
          updateData.cm_code_detail.map((row) => {
            if (row.row_stat == "added") {
              detailRows.map((detailrow) => {
                if (
                  row.detail_code_id.toUpperCase() ==
                  detailrow.detail_code_id.toUpperCase()
                ) {
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
            onRetriveDetail(relationFields);
          } else {
            Notify.createFail();
          }
        });
      } else {
        return warning("중복 데이터가 있어 저장이 불가합니다.");
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
    parent_code_type_id: string;
    system_yn: string;
  };

  /**
   * @method onSubmit
   * @param data
   */
  const onSubmit = async (data: FormProps) => {
    for (const key in data) {
      type oKey = keyof typeof data;
      if (!data[key as oKey]) {
        data[key as oKey] = "%";
      }
    }

    try {
      const searchvalue = {
        ...data,
      };

      const res = await api.retrive(searchvalue);
      if (res) {
        setMasterRows(res);
        setDetailRows([]);
        setIsChanged(false);
        Notify.retrive();
      } else {
        setMasterRows([]);
        setDetailRows([]);
        setIsChanged(false);
        if (gridRef.current) gridRef.current.cleanup();
        warning("조건에 맞는 자료가 없습니다.");
      }
    } catch (err) {
      setMasterRows([]);
      setDetailRows([]);
      setIsChanged(false);
      if (gridRef.current) gridRef.current.cleanup();
      error(err);
    }
  };

  /**
   * 저장 후 Detail Grid 조회
   * @param data
   * @returns
   */
  const onRetriveDetail = (data: any[]) => {
    const param = {
      cm_code_type_id: data,
    };
    api.retriveDetail(param).then((res) => {
      setDetailRows(res);
      setRelationFields(param.cm_code_type_id);
    });
    return data;
  };

  /**
   * Master Grid Row 선택 시 Detail Grid 조회
   * @param data
   * @returns
   */
  const onSelectMasterRow = (data: { cm_code_type_id: any }) => {
    const param = {
      cm_code_type_id: data.cm_code_type_id,
    };

    if (undefined === data.cm_code_type_id) return;

    api.retriveDetail(param).then((res) => {
      setDetailRows(res);
      setRelationFields(param.cm_code_type_id);
    });

    return data;
  };

  /**
   * 마스터-디테일 행변경시 > 임시컨펌
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
            useCleanup={true}
            onSave={onSave}
            useSave={true}
            onRetrive={onRetrive}
            useRetrive={true}
          ></Title>
        }
        searchForm={<Search onSubmit={onSubmit} ref={searchRef} />}
        topContent={
          <MasterGrid
            title="공통 코드 기본 목록"
            originRows={masterRows}
            onSelectRow={onSelectMasterRow}
            setIsChanged={setIsChanged}
            cleanupOther={cleanupOther}
            onRowState={onRowState}
            ref={gridRef}
          />
        }
        bottomContent={
          <DetailGrid
            title="공통 코드 상세 목록"
            originRows={detailRows}
            relationFields={relationFields}
            setIsChanged={setIsChanged}
            ref={detailgridRef}
          />
        }
      ></Template>
    </>
  );
}
