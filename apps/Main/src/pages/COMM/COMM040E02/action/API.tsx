import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
// import { APIRequestConfig } from '../../../common/hook/useSyncAxios';

import { GridDataType } from "../utils/Types";

/**
 * http api POST 통신 처리 Class
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */
export default class ApiCall {
  private httpRequest: (arg0: { url: string; params: any }) => any;
  constructor(apiFunc: (opt: APIRequestConfig<IResData, void, void>) => any) {
    this.httpRequest = apiFunc;
  }

  /**
   * @param dataSet
   *    search_text: 법인 명 또는 비고
   *
   * @returns
   */
  retrive = async (dataSet: { search_text: string }) => {
    const config = {
      url: "/api/comm/COMM040E02/busi-place/",

      params: dataSet,
    };
    return this.httpRequest(config);
  };

  /**
   * save
   * cm_busiplace
   * @returns
   */
  save = async (dataSet: GridDataType[]) => {
    const config = {
      url: `/api/comm/COMM040E02/`,

      params: { cm_busiplace: dataSet },
    };
    return this.httpRequest(config);
  };
}
