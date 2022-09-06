/**
 * UI 개발
 * @module BZCM010E10 인원현황 등록
 * 211216 Koeun
 */
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useHttpCient";
// /disk/common/hook/useHttpCient";
// import { useModal } from "src/common/hook/useModal";
import { Notify } from "@vntgcorp/vntg-wdk-client";
import { error } from "@vntgcorp/vntg-wdk-client";
import { Title } from "@vntgcorp/vntg-wdk-client";
import { userInfoGlobalState } from "@vntgcorp/vntg-wdk-client";

import ApiCall from "./action/API";
import Search from "./layout/100_SearchForm";
import MasterGrid, {
  addRow,
  getGridValues,
  setRowValue,
} from "./layout/200_MasterGrid";
import { FIELD } from "./layout/constants";
import Template from "./layout/Template";
import { FormProps, ForwardFunc, RowDataType } from "./layout/Types";
import { useModal } from "@vntgcorp/vntg-wdk-client";

const getUnitWorkNumber = (equip_code: any, unit_work_code: any) => {
  return `${equip_code}${unit_work_code}`;
};

export default function BZCM010E10() {
  const gridRef = useRef<any>(null);
  const searchRef = useRef<any>(null);
  const modal = useModal();
  const userInfo = useRecoilValue(userInfoGlobalState);
  const [masterRows, setMasterRows] = useState([]);
  const [busiCode, setBusiCode] = useState(userInfo.busi_place);

  const [, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const apiCall = new ApiCall(fetchRequest);

  // useEffect(() => {
  //   modal.ShowCustomModal(<div>test</div>, () => {});
  // }, []);

  useEffect(() => {
    setBusiCode(userInfo.busi_place);
  }, [userInfo]);

  /**
   * 공통 기능 초기화
   * @method onCleanup
   */
  const onCleanup = () => {
    searchRef.current.cleanup();
    gridRef.current.cleanup();
    setMasterRows([]);
  };

  /**
   * 공통 기능 저장
   * @method onSave
   */

  const onSave = () => {
    const data = getGridValues(masterRows);
    if (!data) return;
    if (Array.isArray(data) && data.length === 0) {
      return Notify.createFail();
    }

    const savableData: RowDataType[] = data.map((item) => {
      // for (const key in item) {
      //   if (item[key] === undefined) {
      //     item[key] = null;
      //   }
      // }
      return item;
    });

    apiCall.save(savableData).then((result) => {
      if (result.success) {
        Notify.create();
        onRetrive();
      } else {
        Notify.createFail();
      }
    });
  };

  /**
   * 공통 기능 조회
   * @method onRetrive
   */
  const onRetrive = (clickEvent?: any): void => {
    searchRef.current.submit(!!clickEvent);
  };

  const onSubmit = async (data: FormProps, noneFlag?: boolean) => {
    const {
      emp_name,
      task_plant_code,
      task_equip_code,
      task_unit_work_code,
      busi_place,
    } = data;
    const searchValue = {
      busi_place: busi_place,
      emp_name: "%" + emp_name + "%" || "%",
      plant_code: task_plant_code || "%",
      equip_code: task_equip_code || "%",
      unit_work_code: task_unit_work_code || "%",
    };
    setBusiCode(busi_place);
    try {
      const result = await apiCall.retrive(searchValue);
      if (Array.isArray(result.data) && result.data.length) {
        setMasterRows(result.data);
        if (!noneFlag) return;
        Notify.retrive();
      } else {
        Notify.notfound("인원");
        setMasterRows([]);
      }
    } catch (err: any) {
      error(err.message);
    }
  };

  /**
   *
   * 그리드 행 추가
   */
  const AddRow = () => {
    const {
      busi_place,
      task_plant_code,
      task_equip_code,
      task_unit_work_code,
    } = searchRef.current.getValues() as FormProps;

    let insertData = {
      corp_code: userInfo?.corp_code,
      busi_place,
      [FIELD.ON_WORK_YN]: "Y",
      plant_code: task_plant_code !== "%" ? task_plant_code : null,
      equip_code: task_equip_code !== "%" ? task_equip_code : null,
      unit_work_code: task_unit_work_code !== "%" ? task_unit_work_code : null,
      row_stat: "added",
    };

    // unit_work_no 값 입력: 부서공장, 설비, 직무의 값이 다 선택 되었을시
    if (
      task_plant_code !== "%" &&
      task_equip_code !== "%" &&
      task_unit_work_code !== "%"
    ) {
      insertData = {
        ...insertData,
        [FIELD.UNIT_WORK_NO]: getUnitWorkNumber(
          task_equip_code,
          task_unit_work_code
        ),
      };
    }
    addRow(insertData);
  };

  const onSelectRow = (plant_code: string) => {
    const busi_place = searchRef.current.getValues("busi_place") as string;
    modal.ShowDepartmentModal(setDepartment, { busi_place, plant_code });
  };

  const setDepartment = (modalData: any) => {
    const { dataRow } = gridRef.current.currentFocusedRowIndex();
    if (!modalData) return;
    setRowValue(dataRow, FIELD.PLANT_CODE, modalData[FIELD.PLANT_CODE]);
    setRowValue(dataRow, FIELD.EQUIP_CODE, modalData[FIELD.EQUIP_CODE]);
    setRowValue(dataRow, FIELD.UNIT_WORK_CODE, modalData[FIELD.UNIT_WORK_CODE]);
    setRowValue(dataRow, FIELD.UNIT_WORK_NO, modalData[FIELD.UNIT_WORK_NO]);
  };

  const onChangeBusiCode = () => {
    searchRef.current.setValues({
      task_plant_code: "%",
      task_equip_code: "%",
      task_unit_work_code: "%",
    });
  };
  const onSetUnitWorkNumber = (
    plant_code: string,
    equip_code: string,
    unit_work_code: string
  ) => {
    if (!plant_code || !equip_code || !unit_work_code) return;
    const rowInfo = gridRef.current.currentFocusedRowIndex();
    const number = getUnitWorkNumber(equip_code, unit_work_code);
    setRowValue(rowInfo.dataRow, FIELD.UNIT_WORK_NO, number);
  };

  return (
    <Template
      title={
        <Title
          onSave={onSave}
          onRetrive={() => onRetrive(true)}
          onCleanup={onCleanup}
        />
      }
      searchForm={
        <Search
          busiCode={busiCode}
          defaultBusiCode={userInfo?.busi_place}
          onChangeBusiCode={onChangeBusiCode}
          onSubmit={onSubmit}
          ref={searchRef}
        />
      }
      content={
        <MasterGrid
          title="인원 목록"
          onSetUnitWorkNumber={onSetUnitWorkNumber}
          busiCode={busiCode}
          originRows={masterRows}
          onAddRow={AddRow}
          onSelectRow={onSelectRow}
          ref={gridRef}
        />
      }
    />
  );
}
