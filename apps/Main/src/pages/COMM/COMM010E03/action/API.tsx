import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client";

import { FormDataType } from "../layout/Types";

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
   *    user_id: 사용자 id
   *
   * @returns
   */
  retrive = async (dataSet: { user_id: string }) => {
    const config = {
      url: "/api/common/user-detail/",

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
      url: "api/common/auth/group/",

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
      url: "api/common/auth/role/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };

  /**
   * save
   * cm_user
   * @returns
   */
  save = async (data: FormDataType[]) => {
    const config = {
      url: `/api/common/user-info/`,

      params: { cm_user: data },
    };
    return this.httpRequest(config);
  };
}
