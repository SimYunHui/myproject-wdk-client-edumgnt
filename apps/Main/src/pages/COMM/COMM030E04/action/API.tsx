import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from "../../../common/hook/useSyncAxios";

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
   *    user_level: 레벨
   *    use_yn: 사용 여부
   *
   * @returns
   */
  retrive = async (dataSet: {
    search_text: string;
    user_level: string;
    use_yn: any;
  }) => {
    const config = {
      url: "/api/comm/COMM030E04/user/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   *    user_id: 사용자 id
   *
   * @returns
   */
  retriveDetail = async (dataSet: { user_id: any }) => {
    const config = {
      url: "api/comm/COMM030E04/role/",

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
      url: `/api/common/role/`,

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
  save = async (data: { cm_user_role: any }) => {
    const config = {
      url: `/api/comm/COMM030E04/`,
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
