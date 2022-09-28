/**
 * http api POST 통신 처리 Class
 *
 * @param {object} data Request Data
 * @return {Object} Request Data
 */
 export default class ApiCall {
    private httpRequest;
    constructor(apiFunc) {
      this.httpRequest = apiFunc;
    }
    /*
    * 마스터 그리드 조회 Api Call
    */
    retrieve = async (searchValue) => {
      const config = {
        url: "/api/bzcm/EDU020E01/empCountlist/",
        params: {
          p_use_yn: 'Y'
        },
      };
      return this.httpRequest(config);
    };
  }