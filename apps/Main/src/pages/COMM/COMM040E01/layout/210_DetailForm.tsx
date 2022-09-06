import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { getDate }  from "@vntgcorp/vntg-wdk-client";
import { DetailRow, DetailTitle, Field, Form, SFType }  from "@vntgcorp/vntg-wdk-client";
import { FIELD } from '../utils/constants';
import { MasterGridHandler, MasterGridProps } from '../utils/Types';

const DetailForm = forwardRef<MasterGridHandler, MasterGridProps>(({ row, onSetGridValue, onSubmit }, ref) => {
  const defaultValues = {
    [FIELD.REP_CORP_YN]: '',
    [FIELD.CORP_CODE]: '',
    [FIELD.CORP_NAME]: '',
    [FIELD.CORP_NO]: '',
    [FIELD.CORP_NAME_EN]: '',
    [FIELD.CORP_SHT_NAME]: '',
    [FIELD.PRESIDENT]: '',
    [FIELD.PRESIDENT_EN]: '',
    [FIELD.PRSD_SEC_NO]: '',
    [FIELD.BIZ_TYPE]: '',
    [FIELD.BIZ_ITEM]: '',
    [FIELD.TEL_NO]: '',
    [FIELD.FAX_NO]: '',
    [FIELD.ZIP_CODE]: '',
    [FIELD.ADDR]: '',
    [FIELD.ADDR_EN]: '',
    [FIELD.FOUNDATION_DATE]: '',
    [FIELD.REMARK]: '',
    [FIELD.ROW_STAT]: '',
  };

  const checkOptions = [
    {
      detail_code_id: 'Y',
      detail_code_name: '대표 법인',
    },
  ];

  // const schema = yup.object({
  //   corp_code: Yup.string().required('법인 코드' + requiredMessage.REQUIRE),
  // });

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
        case FIELD.REP_CORP_YN:
          _key = FIELD.REP_CORP_YN + '@@Y';
          break;
        case FIELD.FOUNDATION_DATE:
          value = value ? getDate(value) : null;
          break;
        case FIELD.CORP_NO:
          _key = 'corp_no';
          break;
        case FIELD.CORP_NAME:
          _key = 'corp_name';
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
      formName="법인 정보 등록"
      useTable="Y"
      styles={{ height: '100%', minHeight: '500px' }}
    >
      <DetailTitle
        title="법인 상세 정보"
        tableStyle={{
          width: '580px',
          tableLayout: 'fixed',
        }}
      >
        <DetailRow>
          <Field
            label=""
            labelStyles={{ width: 100 }}
            name={FIELD.REP_CORP_YN}
            type={SFType.Checkbox}
            options={checkOptions}
            onChange={onSetGridValue}
          />
        </DetailRow>
        <DetailRow>
          <Field
            required
            label="법인 코드"
            name="corp_code"
            type={SFType.Text}
            colspan={2}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            required
            label="법인 명"
            name={FIELD.CORP_NAME} //"corp_name"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
          <Field
            required
            label="법인 번호"
            labelStyles={{ width: 100 }}
            name={FIELD.CORP_NO} //"corp_no"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="법인 명(영문)"
            name={FIELD.CORP_NAME_EN} //"corp_name_en"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
          <Field
            label="법인 명(약어)"
            name={FIELD.CORP_SHT_NAME} //"corp_sht_name"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="대표자 명"
            name={FIELD.PRESIDENT} //"president"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
          <Field
            label="대표자 명(영문)"
            name={FIELD.PRESIDENT_EN} //"president_en"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="대표자 번호"
            name={FIELD.PRSD_SEC_NO} //"prsd_sec_no"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="업태"
            name={FIELD.BIZ_TYPE} //"biz_type"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
          <Field
            label="업종"
            name={FIELD.BIZ_ITEM} //"biz_item"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="전화 번호"
            name={FIELD.TEL_NO} //"tel_no"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
          <Field
            label="팩스 번호"
            name={FIELD.FAX_NO} //"fax_no"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="우편 번호"
            name={FIELD.ZIP_CODE} //"zip_code"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="주소"
            colspan={2}
            name={FIELD.ADDR} //"addr"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
            styles={{ width: 455 }}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="주소(영문)"
            colspan={2}
            name={FIELD.ADDR_EN} //"addr_en"
            type={SFType.Text}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
            styles={{ width: 455 }}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="설립 일자"
            name={FIELD.FOUNDATION_DATE} //"foundation_date"
            type={SFType.Datepicker}
            onChange={onSetGridValue}
            styles={{ width: 134 }}
          />
        </DetailRow>
        <DetailRow>
          <Field
            label="비고"
            colspan={2}
            name={FIELD.REMARK} //"remark"
            type={SFType.TextArea}
            styles={{ width: 455, height: 50 }}
            onChange={(e: { target: { name: any; value: any } }) => onSetGridValue(e.target.name, e.target.value)}
          />
        </DetailRow>
      </DetailTitle>
    </Form>
  );
});
export default React.memo(DetailForm);
