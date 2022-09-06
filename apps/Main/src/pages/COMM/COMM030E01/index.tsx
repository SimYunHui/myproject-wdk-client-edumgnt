/**
 * UI 개발 COMM030E01 프로그램 정보 등록
 *
 * @module COMM030E01
 * 211115 pang
 */
import { useRef, useState } from "react";
import { Title } from "@vntgcorp/vntg-wdk-client";

import { Search } from "./layout/100_SearchForm";
import { Grid } from "./layout/200_ProgramGrid";
import { DetailGrid } from "./layout/210_DetailGrid";
import {
  MasterGridHandler,
  SearchHandler,
  DetailGridHandler,
} from "./layout/Types";
import Template from "./layout/Template";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import ApiCall from "./action/API";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { info } from "@vntgcorp/vntg-wdk-client";

/**
 * COMM030E01
 */
export default function COMM030E01() {
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
  const [systemCode, setSystemCode] = useState([]);
  const [systemGroupData, setSystemGroupData] = useState<{
    [x: string]: string;
  }>({});

  /**
   * 공통 기능 저장
   * @method onSave
   */
  const onSave = () => {
    detailGridRef.current.toSave();
  };

  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const Cleanup = () => {
    /*  */
    masterGridRef.current.cleanup();
    detailGridRef.current.cleanup();
    searchRef.current.cleanup();
    info("초기화되었습니다.");
  };
  /**
   * 공통 기능 저장
   * @method sendData
   */
  const sendData = (datas: any) => {
    if (!datas.length) {
      Notify.createFail();
      return;
    }
    datas.forEach((_curr: any, i: string | number) => {
      datas[i].system_code = systemCode;
      datas[i].pgm_url = "/" + systemGroupData["url"] + "/" + datas[i].pgm_id;
    });

    api.saveData(datas).then(() => {
      Notify.create();
      onRetrive();
    });
  };
  const sendMasterData = () => {};

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
    /**
      system_code: 시스템 코드, 필수      
      search_text: 프로그램 ID 및 명 , 필수

     */
    const mastersearchvalue = {
      system_code: data.selectBox,
    };

    api.retriveGroup(mastersearchvalue).then((res) => {
      setprogramMasterRows(res.data);
      if (res.data == null) {
        Notify.notfound("시스템 그룹 목록");
        return;
      }
      Notify.retrive();
    });
  };
  const onSelectMasterRow = (data: any) => {
    setProgramDetailRows([]);
    setSystemCode(data.system_code);
    const param = {
      system_group_code: data.system_group_code,

      // busi_place: data.busi_place,
      // daily_work_no: data.daily_work_no,
    };

    api.retriveDetail2(param).then((res) => {
      setProgramDetailRows(res.data);
    });
    detailGridRef.current.getSystemCode(param.system_group_code);
    setSystemGroupData(data);
    console.log(data);
    return data;
  };

  /**
   * 마스터-디테일 행변경시 > 임시컨펌
   * @method onRowState
   */
  const onRowState = (): number => {
    const detailCount = detailGridRef.current.changeData();
    return detailCount;
  };

  /**
   * Master Row Add 시 나머지 Grid 초기화
   */
  const cleanupOther = () => {
    detailGridRef.current.cleanup();
  };

  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = () => {
    detailGridRef.current.cleanup();
    searchRef.current.submit();
  };
  const onCleanup = () => {
    searchRef.current.cleanup();
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
            onSave={onSave}
            onRetrive={onRetrive}
            onCleanup={Cleanup}
          ></Title>
        }
        searchForm={<Search onSubmit={onSubmit} ref={searchRef}></Search>}
        topContent={
          <Grid
            ref={masterGridRef}
            title="시스템 그룹 목록"
            originRows={programMasterRows}
            onSelectRow={onSelectMasterRow}
            saveMasterData={sendMasterData}
            onRowState={onRowState}
            cleanupOther={cleanupOther}
          ></Grid>
        }
        bottomContent={
          <DetailGrid
            ref={detailGridRef}
            title="프로그램 정보 등록"
            originRows={programDetailRows}
            saveData={sendData}
          ></DetailGrid>
        }
      ></Template>
    </>
  );
}
