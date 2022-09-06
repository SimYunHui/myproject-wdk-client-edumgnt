import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { getDate } from "@vntgcorp/vntg-wdk-client";
import {
  DetailRow,
  DetailTitle,
  Field,
  Form,
  SFType,
} from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "../utils/constants";
import { MasterGridHandler, MasterGridProps } from "../utils/Types";

const DetailForm = forwardRef<MasterGridHandler, MasterGridProps>(
  ({ row, onSetGridValue, onSubmit }, ref) => {
    const defaultValues = {
      [FIELD.REP_BUSI_PLACE_YN]: "",
      [FIELD.CORP_CODE]: "",
      [FIELD.BUSI_PLACE]: "",
      [FIELD.BUSINESS_NO]: "",
      [FIELD.BUSI_PLACE_NAME]: "",
      [FIELD.BUSI_PLACE_NAME_EN]: "",
      [FIELD.BUSI_PLACE_SHT_NAME]: "",
      [FIELD.PRESIDENT]: "",
      [FIELD.PRESIDENT_EN]: "",
      [FIELD.BIZ_TYPE]: "",
      [FIELD.BIZ_ITEM]: "",
      [FIELD.ZIP_CODE]: "",
      [FIELD.ADDR]: "",
      [FIELD.ADDR_EN]: "",
      [FIELD.TEL_NO]: "",
      [FIELD.FAX_NO]: "",
      [FIELD.TAX_OFFICE_CODE]: "",
      [FIELD.HOMETAX_ID]: "",
      [FIELD.SLAVE_BUSI_NO]: "",
      [FIELD.SUM_RECOG_NO]: "",
      [FIELD.PRSD_SEC_NO]: "",
      [FIELD.HOMEPAGE]: "",
      [FIELD.CUST_CODE]: "",
      [FIELD.ITEM_CODE]: "",
      [FIELD.BIZ_DATE]: "",
      [FIELD.REMARK]: "",
      [FIELD.ROW_STAT]: "",
    };

    const checkOptions = [
      {
        detail_code_id: "Y",
        detail_code_name: "대표 사업장",
      },
    ];

    const form = useForm({ defaultValues });

    const handleSubmit = form.handleSubmit(onSubmit);

    useImperativeHandle(ref, () => ({
      getValues(name: any) {
        return form.getValues(name);
      },
      cleanup() {
        form.reset();
      },
      submit() {
        handleSubmit();
      },
    }));

    useEffect(() => {
      form.reset();
      if (!row) return;

      for (const [_, key] of Object.entries(FIELD)) {
        type ObjectKey = keyof typeof row;
        let value = row[key as ObjectKey] as any;
        let _key = key;

        switch (key) {
          case FIELD.REP_BUSI_PLACE_YN:
            _key = FIELD.REP_BUSI_PLACE_YN + "@@Y";
            break;
          case FIELD.BIZ_DATE:
            value = value ? getDate(value) : null;
            break;
          case FIELD.BUSI_PLACE:
            _key = "busi_place";
            break;
          case FIELD.BUSI_PLACE_NAME:
            _key = "busi_place_name";
            break;
        }
        form.setValue(_key, value);
      }
    }, [row]);

    return (
      <Form
        {...form}
        onSubmit={handleSubmit}
        formType="detail"
        formName="사업장 정보 등록"
        useTable="Y"
        styles={{ height: "100%", minHeight: "500px" }}
      >
        <DetailTitle
          title="사업장 상세 정보"
          tableStyle={{
            width: "580px",
            tableLayout: "fixed",
          }}
        >
          <DetailRow>
            <Field
              label=""
              labelStyles={{ width: 100 }}
              name={FIELD.REP_BUSI_PLACE_YN}
              type={SFType.Checkbox}
              options={checkOptions}
              onChange={onSetGridValue}
            />
          </DetailRow>
          <DetailRow>
            <Field
              required
              label="사업장 코드"
              name={FIELD.BUSI_PLACE}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              required
              label="사업자 등록 번호"
              labelStyles={{ width: 100 }}
              name={FIELD.BUSINESS_NO}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              required
              label="사업장 명"
              name={FIELD.BUSI_PLACE_NAME}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              label="사업장 명(영문)"
              name={FIELD.BUSI_PLACE_NAME_EN}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="사업장 명(약어)"
              name={FIELD.BUSI_PLACE_SHT_NAME}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="대표자 명"
              name={FIELD.PRESIDENT}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              label="대표자 명(영문)"
              name={FIELD.PRESIDENT_EN}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="대표자 주민번호"
              name={FIELD.PRSD_SEC_NO}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="업태"
              name={FIELD.BIZ_TYPE}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              label="업종"
              name={FIELD.BIZ_ITEM}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="전화 번호"
              name={FIELD.TEL_NO}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              label="팩스 번호"
              name={FIELD.FAX_NO}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="우편 번호"
              name={FIELD.ZIP_CODE}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              label="국세청 ID"
              name={FIELD.HOMETAX_ID}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="주소"
              colspan={2}
              name={FIELD.ADDR}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
              styles={{ width: 455 }}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="주소(영문)"
              colspan={2}
              name={FIELD.ADDR_EN}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
              styles={{ width: 455 }}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="개업 일자"
              name={FIELD.BIZ_DATE}
              type={SFType.Datepicker}
              styles={{ width: 134 }}
              onChange={onSetGridValue}
            />
            <Field
              label="세무서"
              name={FIELD.TAX_OFFICE_CODE}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="종목 코드"
              name={FIELD.ITEM_CODE}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
            <Field
              label="거래처 코드"
              name={FIELD.CUST_CODE}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="종속 사업자 번호"
              name={FIELD.SLAVE_BUSI_NO}
              type={SFType.Text}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="비고"
              colspan={2}
              name={FIELD.REMARK}
              type={SFType.TextArea}
              styles={{ width: 455, height: 50 }}
              onChange={(e: { target: { name: any; value: any } }) =>
                onSetGridValue(e.target.name, e.target.value)
              }
            />
          </DetailRow>
        </DetailTitle>
      </Form>
    );
  }
);

export default React.memo(DetailForm);
