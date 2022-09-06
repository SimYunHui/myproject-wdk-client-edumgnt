import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client";

import { RowDataType } from "../util/Types";

/**
 * http api POST 통신 처리 Class
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */
export default class ApiCall {
  private httpRequest;
  constructor(apiFunc: (opt: APIRequestConfig<IResData, void, void>) => any) {
    this.httpRequest = apiFunc;
  }

  /**
   * Retrieve Master Grid
   * @param dataSet
   *    search_text: 공통 코드 유형 명
   *    parent_code_type_id: 상위 공통 코드 ID
   *    system_yn: 시스템 여부
   *
   * @returns
   */
  retrive = async (dataSet: {
    search_text: string;
    parent_code_type_id: string;
    system_yn: string;
  }) => {
    const config = {
      url: "/api/comm/COMM020E01/master/",

      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action Retrive Master Grid ::: error ::: " + error);
      });
  };
  /**
   * Retrieve Detail Grid
   * @param dataSet
   *    cm_code_type_id: 공통 코드 유형 ID
   *
   * @returns
   */
  retriveDetail = async (dataSet: { cm_code_type_id: any }) => {
    const config = {
      url: "/api/comm/COMM020E01/detail/",

      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action Retrive Detail Grid ::: error ::: " + error);
      });
  };
  /**
   * Save
   * cm_code_master
   * cm_code_detail
   * @returns
   */
  save = async (data: {
    cm_code_master: RowDataType[];
    cm_code_detail: any[];
  }) => {
    const config = {
      url: `/api/comm/COMM020E01/`,
      params: data,
    };
    // return this.httpRequest(config);
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action Save Data ::: error ::: " + error);
      });
  };
}
