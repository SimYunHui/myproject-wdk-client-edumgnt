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
      url: '/api/bzcm/BZCM020E10/list/',
      params: {
        p_report_write_date_fr: searchValue.DATARANGE_start,
        p_report_write_date_to: searchValue.DATARANGE_end,
        p_emp_name: searchValue.EMP_NAME,
      },
    };
    return this.httpRequest(config);
  };

  /**
   * 저장
   * @param datas
   * @returns
   */
  saveData = async (master) => {
    const config = {
      url: '/api/bzcm/BZCM020E10/',
      params: { bzcm02010_a2: master, bzcm02011_a2: [] },
    };
    return this.httpRequest(config);
  };
}
