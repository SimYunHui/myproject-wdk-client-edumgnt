import { RowDataType } from "../layout/Types";
/**
 * http api POST 통신 처리 Class
 * @param {object} data Request Data
 * @return {Object} Request Data
 */

const URL = "/api/bzcm/BZCM010E10/";

export default class ApiCall {
  private httpRequest;
  constructor(apiFunc: any) {
    this.httpRequest = apiFunc;
  }

  /**
   * 인원 저장
   * @params
   * birthday: 생년월일
   * birthday_type: null
   * busi_place: 공장
   * corp_code: 법인코드
   * email: 이메일
   * emp_name: 성명
   * emp_no: 사번
   * ent_date: 입사일자
   * equip_code: 설비
   * mobile_no: 휴대폰 번호
   * on_work_yn: 재직여부
   * plant_code: 공장부서
   * responsi: 직책
   * row_stat: 데이터 상태
   * tel_no: 전화번호
   * unit_work_code: 직무 코드
   * unit_work_no: 직무넘버
   * user_id: 사용자id
   * @returns
   */
  save = async (dataSet: RowDataType[]) => {
    const config = {
      url: URL,
      params: { cm_employee: dataSet },
    };
    return this.httpRequest(config);
  };

  /**
   * 인원현황등록 조회
   * @param
   * busi_place: 공장,
   * dept_code: 법인코드,
   * emp_name: 직원 성명,
   * plant_code: 공장부서,
   * equip_code: 설비,
   * unit_work_code: 직무,
   * @returns
   */
  retrive = async (dataSet :any) => {
    const config = {
      url: `${URL}list/`,
      params: dataSet,
    };
    return this.httpRequest(config);
  };
}
