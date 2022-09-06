// import { APIRequestConfig } from '../../../common/hook/useAxios';
// import { IResData } from '../../../common/hook/useSyncAxios';
import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";
import { MasterGridRowDataType, SearchRowDataType } from "../layout/Types";

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

  retriveNoticeList = async (params: SearchRowDataType) => {
    const config = {
      url: "/api/bzcm/BZCM010E20/list/",
      params,
    };
    return this.httpRequest(config);
  };

  retriveNoticeArticle = async (articleSno: number) => {
    const config = {
      url: `/api/bzcm/BZCM010E20/list/${articleSno}`,
    };
    return this.httpRequest(config);
  };

  saveNotice = async (articleData: MasterGridRowDataType) => {
    const config = {
      url: `/api/bzcm/BZCM010E20/`,
      params: { bzcm01010: [articleData] },
    };
    return this.httpRequest(config);
  };
}
