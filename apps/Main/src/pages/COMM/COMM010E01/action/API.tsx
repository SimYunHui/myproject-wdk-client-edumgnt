// import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client";
import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
import { FormProps } from "../layout/Types";

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
   * @param dataSet
   *    search_text: 사용자 ID/사용자 명
   *    user_level: 레벨
   *    use_yn: 사용 여부
   *
   * @returns
   */
  retrive = async (dataSet: FormProps) => {
    const config = {
      url: "/api/comm/COMM010E01/user/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   *    user_id: 사용자 ID
   *
   * @returns
   */
  retriveFirstDetail = async (dataSet: { user_id: string }) => {
    const config = {
      url: "api/comm/COMM010E01/group/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   *    user_id: 사용자 ID
   *
   * @returns
   */
  retriveSecondDetail = async (dataSet: { user_id: string }) => {
    const config = {
      url: "api/comm/COMM010E01/role/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };
  /**
   *
   * @param dataSet
   */
  retriveFirstModal = async (dataSet: { search_text: string }) => {
    const config = {
      url: `/api/common/group/`,

      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action Retrive First Modal ::: error ::: " + error);
      });
  };
  /**
   *
   * @param dataSet
   */
  retriveSecondModal = async (dataSet: { search_text: string }) => {
    const config = {
      url: `/api/common/role/`,

      params: dataSet,
    };
    return this.httpRequest(config)
      .then((response: { data: any }) => {
        return response?.data;
      })
      .catch((error: string) => {
        console.log("Action Retrive Second Modal ::: error ::: " + error);
      });
  };
  /**
   * save
   * cm_user
   * cm_group_users
   * cm_user_role
   * @returns
   */
  save = async (data: {
    cm_user: any;
    cm_group_users: any;
    cm_user_role: any;
  }) => {
    const config = {
      url: `/api/comm/COMM010E01/`,
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
