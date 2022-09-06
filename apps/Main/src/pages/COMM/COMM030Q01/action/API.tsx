// import { IResData } from '../../../common/hook/useAxios';
// import { APIRequestConfig } from '../../../common/hook/useSyncAxios';

import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";

/**
 * http api POST 통신 처리 Class
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */
export default class ApiCall {
  private httpRequest: (arg0: { url: string; params?: any }) => Promise<any>;
  constructor(apiFunc: (opt: APIRequestConfig<IResData, void, void>) => any) {
    this.httpRequest = apiFunc;
  }

  // 사업장 조회.
  //
  retrivePlace = async () => {
    const config = {
      url: "/api/common/busi-place/",
    };

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
    return this.httpRequest(config);
  };

  /**
   * @param dataset
   *    search_text : 사용자 ID 혹은 사용자명, 필수
   * @returns
   */
  retriveUserList = async (dataSet: { search_text: string }) => {
    const config = {
      url: "/api/comm/COMM030Q01/user/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };

  /**
   * @param dataset
   *    p_user_id: 사용자 id, 필수
   * @returns
   */
  retriveUserMenuAuthList = async (dataset: { p_user_id: any }) => {
    const config = {
      url: "/api/comm/COMM030Q01/menu-auth/",

      params: dataset,
    };
    return this.httpRequest(config)
      .then((_response: any) => {
        return this.httpRequest(config);
      })
      .catch((error: any) => {
        console.log("COMM030Q01 retriveTreeMenuList ⛔ " + error);
      });
  };

  /**
   * @param dataset
   * @returns
   */
  retriveDetailWorkSet = async () => {
    const config = {
      url: "/api/bzcm/BZCM020E20/worklist/",
    };
    return this.httpRequest(config);
  };

  /**
   * 저장
   * @param cm_program
   *pgm_id: 프로그램 id, 필수
   *pgm_name: 프로그램명,필수
   *pgm_type: 프로그램 타입,필수
   *pgm_url: 프로그램 URL, 필수
   *use_yn: 사용여부, 필수
   *first_rg_yms: 생성날짜
   *first_rg_idf: "",
   *last_update_yms: 최근 업데이트날짜,
   *last_update_idf: "",
   *system_code: 시스템코드,
   *row_stat: "modified"
   * @returns
   */
  saveData = async (cm_program: any): Promise<any> => {
    const config = {
      url: "/api/comm/COMM030E01/",

      params: { cm_program },
    };
    return this.httpRequest(config);
  };
}
