import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import {
  DetailRow,
  DetailTitle,
  Field,
  Form,
  SFType,
} from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "./constants";
import { FormDataType } from "./Types";
// import "./myAccount.scss";

export type DetailFormHandler = {
  submit: () => void;
  getValues: () => FormDataType;
};

type DetailFormProps = {
  rowdata?: any;
  ref?: React.ReactNode;
};

const DetailForm: React.FC<DetailFormProps> = forwardRef(({ rowdata }, ref) => {
  /**
   * Hook 선언
   */
  const form = useForm({});

  useImperativeHandle(ref, () => ({
    submit() {
      retriveForm();
    },
    getValues() {
      return form.getValues();
    },
    cleanup() {
      form.reset();
    },
  }));

  const handleSubmit = (data: any) => {
    return data;
  };

  const retriveForm = () => {
    if (rowdata) {
      form.setValue(FIELD.USER_NAME, rowdata[0].user_name);
      form.setValue(FIELD.USER_ID, rowdata[0].user_id);
      form.setValue(FIELD.PWD, rowdata[0].pwd);
      form.setValue(FIELD.BUSI_PLACE_NAME, rowdata[0].busi_place_name);
      form.setValue(FIELD.EMP_NO, rowdata[0].emp_no);
      form.setValue(FIELD.USER_LEVEL, rowdata[0].user_level);
      form.setValue(FIELD.UNIT_WORK_NAME, rowdata[0].unit_work_name);
      form.setValue(FIELD.PLANT_NAME, rowdata[0].plant_name);
      form.setValue(FIELD.EQUIP_NAME, rowdata[0].equip_name);
      form.setValue(FIELD.RESPONSI_NAME, rowdata[0].responsi_name);
      form.setValue(FIELD.EMAIL, rowdata[0].email);
      form.setValue(FIELD.TEL_NO, rowdata[0].tel_no);
      form.setValue(FIELD.USE_YN, rowdata[0].use_yn);
      form.setValue(FIELD.REMARK, rowdata[0].remark);
    }
  };

  return (
    <>
      <Form
        {...form}
        onSubmit={handleSubmit}
        formType="detail"
        formName="사용자 정보"
        useTable="Y"
        styles={{ height: "100%" }}
      >
        <DetailTitle
          title="사용자 정보"
          tableStyle={{ width: "1200px", tableLayout: "fixed" }}
        >
          <DetailRow
            styles={{
              fontSize: "13px",
              boxSizing: "border-box",
              height: "50px",
            }}
          >
            <Field
              label=""
              name=""
              type={SFType.Custom}
              labelStyles={{ width: 200 }}
            >
              <div className="infoBlock">
                <i className="Licon size-20 ico-my" />
                <span>개인정보</span>
              </div>
            </Field>
            <Field
              label=""
              name=""
              type={SFType.Custom}
              labelStyles={{ width: 200 }}
            >
              <div className="infoBlock">
                <i className="Licon size-20 ico-community" />
                <span>사내정보</span>
              </div>
            </Field>
          </DetailRow>
          <DetailRow>
            <Field
              label="사용자 명"
              name={FIELD.USER_NAME}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
            <Field
              label="사업장"
              name={FIELD.BUSI_PLACE_NAME}
              type={SFType.Text}
              labelStyles={{ width: 200 }}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="아이디"
              name={FIELD.USER_ID}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px", height: "22px" }}
              readOnly={true}
            />
            <Field
              label="사원번호"
              name={FIELD.EMP_NO}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="현재 비밀번호"
              name={FIELD.PWD}
              type={SFType.Password}
              placeholder="현재 비밀번호"
              styles={{ width: 250, marginBottom: "10px", height: "22px" }}
              required
            />
            <Field
              label="부서"
              name={FIELD.UNIT_WORK_NAME}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="새 비밀번호"
              name={FIELD.PWD_NEW}
              type={SFType.Password}
              placeholder="새 비밀번호"
              styles={{ width: 250, marginBottom: "10px", height: "22px" }}
              required
            />
            <Field
              label="공정"
              name={FIELD.PLANT_NAME}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field label="" name="" type={SFType.Custom}>
              <div style={{ fontSize: "0.688rem", color: "#8d8d8d" }}>
                * 영문/숫자/특수문자(~, !, @, $, ^, * 만 사용 가능)를 조합하여
                최소 8자 이상 20자 이내 대소문자를 구별하여 입력하세요.
              </div>
            </Field>
            <Field
              label="담당 설비"
              name={FIELD.EQUIP_NAME}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="새 비밀번호 확인"
              name={FIELD.PWD_CHK}
              type={SFType.Password}
              placeholder="새 비밀번호 확인"
              styles={{ width: 250, marginBottom: "10px", height: "22px" }}
              required
            />
            <Field
              label="직무"
              name={FIELD.RESPONSI_NAME}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="이메일"
              name={FIELD.EMAIL}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              required
            />
            <Field
              label="사용자 레벨"
              name={FIELD.USER_LEVEL}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              readOnly={true}
            />
          </DetailRow>
          <DetailRow>
            <Field label="" name="" type={SFType.Custom} colspan={2}>
              <div style={{ fontSize: "0.688rem", color: "#8d8d8d" }}>
                * 비밀번호 분실 시 입력하신 이메일로 비밀번호를 알려드립니다.
              </div>
            </Field>
          </DetailRow>
          <DetailRow>
            <Field
              label="전화번호"
              name={FIELD.TEL_NO}
              type={SFType.Text}
              styles={{ width: 250, marginBottom: "10px" }}
              placeholder="000-0000-0000"
              colspan={2}
              required
            />
          </DetailRow>
          <DetailRow>
            <Field label="" name="" type={SFType.Custom} colspan={2}>
              <div style={{ fontSize: "0.688rem", color: "#8d8d8d" }}>
                * 비상연락이 가능한 휴대전화번호를 입력하세요.
              </div>
            </Field>
          </DetailRow>
          <DetailRow styles={{ height: "33px" }}>
            <Field label="" name="" type={SFType.Custom} colspan={2}>
              <div style={{ fontSize: "0.688rem", color: "#8d8d8d" }}>
                * 000-0000-0000 형태로 입력하세요.
              </div>
            </Field>
          </DetailRow>
        </DetailTitle>
      </Form>
    </>
  );
});

export default DetailForm;
