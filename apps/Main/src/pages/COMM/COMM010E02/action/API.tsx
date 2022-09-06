import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client";

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
   *    search_text: 그룹 명
   *    use_yn: 사용 여부
   *
   * @returns
   */
  retrive = async (dataSet: { search_text: string; use_yn: string }) => {
    const config = {
      url: "/api/comm/COMM010E02/group/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   *    grpup_sno: 그룹 일련번호
   *
   * @returns
   */
  retriveDetail = async (dataSet: { group_sno: number }) => {
    const config = {
      url: "api/comm/COMM010E02/user/",

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
   * save
   * cm_group
   * cm_group_users
   * @returns
   */
  save = async (data: { cm_group: any; cm_group_users: any }) => {
    const config = {
      url: `/api/comm/COMM010E02/`,
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
