import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from "../../../common/hook/useSyncAxios";

import { MasterGridRowDataType, DetailGridRowDataType } from "../layout/Types";

/**
 * http api POST 통신 처리 Class
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */
export default class ApiCall {
  private httpRequest;
  constructor(apiFunc: {
    (opt: APIRequestConfig<IResData, void, void>): any;
    (opt: APIRequestConfig<IResData, void, void>): any;
  }) {
    this.httpRequest = apiFunc;
  }

  /**
   * @param dataSet
   *    search_text: 사용자 id 및 명
   *    use_yn: 사용 여부
   *
   * @returns
   */
  retrive = async (dataSet: {
    search_text: string | String;
    use_yn: string | String;
  }) => {
    const config = {
      url: "/api/comm/COMM030E03/role/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   *    role_no: Role 번호
   *
   * @returns
   */
  retriveDetail = async (dataSet: { role_no: any }) => {
    const config = {
      url: "api/comm/COMM030E03/user/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   */
  retriveModal = async (dataSet: { search_text: string }) => {
    const config = {
      url: `/api/common/user/`,

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
   * @param cm_user_role
   * @returns
   */
  save = async (data: {
    cm_role: MasterGridRowDataType[];
    cm_user_role: DetailGridRowDataType[];
  }) => {
    const config = {
      url: `/api/comm/COMM030E03/`,
      params: data,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action Save Data ::: error ::: " + error);
      });
  };
}
