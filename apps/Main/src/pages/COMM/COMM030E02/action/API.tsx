/**
 * http api POST 통신 처리 Class
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */

import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from '../../../common/hook/useSyncAxios';

//
export default class ApiCall {
  private httpRequest;
  constructor(apiFunc: {
    (opt: APIRequestConfig<IResData, void, void>): any;
    (opt: APIRequestConfig<IResData, void, void>): any;
  }) {
    this.httpRequest = apiFunc;
  }

  // 사업장 조회.
  retrivePlace = async () => {
    const config = {
      url: "/api/common/busi-place/",
    };
    console.log("사업장");
    return this.httpRequest(config);
  };
  /**
   * @param  dataset
   * busi_place: 사업장, 필수
   * parent_dept_code: 상위 부서
   * dept_name : 부서명
   * @returns
   */
  // 부서 및 공장 조회.
  retriveDept = async (dataset: any) => {
    const config = {
      url: "/api/common/dept/",

      params: dataset,
    };
    console.log("부서");
    return this.httpRequest(config);
  };
  retriveProgram = async (menu_sno: any) => {
    const config = {
      url: `/api/comm/COMM030E02/program/`,
      params: {
        menu_sno: menu_sno,
      },
    };
    return this.httpRequest(config);
  };

  /**
   * @param dataset
   *    p_system_type : 시스템타입(S01:SHE, S02:협력사)
   * @returns
   */
  retriveTreeMenuList = async (dataSet: {
    system_type: string;
    /**
     *
     * @param dataSet
     */
  }) => {
    const config = {
      url: "/api/comm/COMM030E02/menu/",

      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response.data;
      })
      .catch((error: string) => {
        console.log("COMM030E05 retriveTreeMenuList ⛔ " + error);
      });
  };
  /**
   * @param dataset
   *    run_sno: 프로그램 실행 일련번호, 필수
   * @returns
   */
  retriveProgramList = async (dataset: { menu_sno: any }) => {
    const config = {
      url: "/api/comm/COMM030E02/program/",

      params: dataset,
    };
    return this.httpRequest(config);
  };
  /**
   * @param dataset
   *    run_sno: 프로그램 실행 일련번호, 필수
   * @returns
   */
  retriveProgramDetail = async (dataset: { run_sno: number }) => {
    const config = {
      url: "/api/comm/COMM030E02/param/",

      params: dataset,
    };
    return this.httpRequest(config);
  };

  /**
   *
   * @param dataSet
   */
  retriveProgramModal = async (dataSet: {
    search_text: string;
    /**
     * @param dataset
     *    run_sno: 프로그램 실행 일련번호, 필수
     * @returns
     */
    system_code: string;
  }) => {
    const config = {
      url: `/api/common/program/`,
      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action retriveModal ::: error ::: " + error);
      });
  };
  /**
   *
   * @param dataSet
   */
  retriveUserModal = async (dataSet: any) => {
    console.log(dataSet);
    const config = {
      url: `/api/comm/COMM030E04/user/`,

      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action retriveModal ::: error ::: " + error);
      });
  };

  /**
   * 저장
   * @param cm_user_menu
   *user_id: user id, 필수
   *menu_sno: 메뉴 일련번호,필수
   *menu_name: 메뉴 명,필수
   *parent_menu_sno: 부모 메뉴 일련번호,무조건 Null 필수
   *sort_seq: 정렬순서, 필수
   *first_rg_yms: 생성날짜
   *first_rg_idf: "",
   *last_update_yms: 최근 업데이트날짜,
   *last_update_idf: "",
   *row_stat: 행 상태
   * @returns
   * @param cm_user_menu_pgm
   *user_id: user id, 필수
   *menu_sno: 메뉴 일련번호,필수
   *run_sno: 실행 일련번호,필수
   *sort_seq: 정렬순서, 필수
   *row_stat: 행 상태
   * @returns
   */
  save = async (datas: any) => {
    console.log("COMM030E02_Menu_Save:");
    console.log("메뉴등록 저장객체" + JSON.stringify(datas));
    const config = {
      url: `/api/comm/COMM030E02/`,
      params: datas,
    };
    console.log(" >>>>> send menu manager Data : " + JSON.stringify(datas));
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("COMM030E02 save ⛔ ::: " + error);
      });
  };
}
