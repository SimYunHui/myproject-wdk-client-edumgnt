//
import { IResData } from "@vntgcorp/vntg-wdk-client";
import { APIRequestConfig } from "@vntgcorp/vntg-wdk-client/dist/app/src/common/hook/useAxios";

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

  retrivePlace = async () => {
    const config = {
      url: "/api/common/busi-place/",
    };
    return this.httpRequest(config);
  };
  //
  // /**
  //  * @param dataSet
  //  * etc_ctnt1: 시스템 코드, 필수
  //  * @returns
  //  */
  // retrive = async (dataSet) => {
  //   const config = {
  //     url: '/api/common/code/AA04/list/',
  //
  //     params: dataSet,
  //   };
  //   return this.httpRequest(config);
  // };

  /**
   * @param dataset
   *    etc_ctnt1 : 시스템 코드, 필수
   * @returns
   */
  retriveGroup = async (dataSet: { system_code: string }) => {
    const config = {
      url: "/api/comm/COMM030E01/group/",
      // url: '/api/common/code/AA04/list/',

      params: dataSet,
    };
    return this.httpRequest(config);
  };

  /**
   * @param dataset
   *    system_code: 시스템 코드, 필수
   *    search_text : 프로그램 id 및 명, 필수
   * @returns
   */
  retriveDetail = async (dataset: any) => {
    const config = {
      url: "/api/comm/COMM030E01/program/",

      params: dataset,
    };
    return this.httpRequest(config);
  };

  /**
   * @param  dataset
   * system_group_code: 시스템 그룹코드, 필수
   * @returns
   */

  retriveDetail2 = async (dataset: { system_group_code: any }) => {
    const config = {
      url: "/api/comm/COMM030E01/program/",

      params: dataset,
    };
    return this.httpRequest(config);
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
   *system_code: 시스템코드,
   *row_stat: "modified"
   * @returns
   */
  saveData = async (cm_program: any) => {
    const config = {
      url: "/api/comm/COMM030E01/",

      params: { cm_program },
    };
    return this.httpRequest(config);
  };
}
