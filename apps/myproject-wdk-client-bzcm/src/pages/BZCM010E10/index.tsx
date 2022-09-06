import React, { useMemo } from 'react';
import {
  Form,
  useForm,
  Yup,
  requiredMessage,
  SearchRow,
  SFType,
  Field,
  LEField,
  Button,
  getDate,
  DetailTitle,
  DetailRow,
} from '@vntgcorp/vntg-wdk-client';
import { FILE } from 'dns';

export default function BZCM010E10() {
  /** 초기값 설정 */
  const defaultValues = {
    Datepicker_name:getDate(new Date().toString()),
  };

  /** 유효성: 필수값 설정 */
  const schema = useMemo(() => {
    return Yup.object({
      Text: Yup.string().required(),
    });
  }, []);

  /** React-hook-form 선언 */
  const form = useForm({ defaultValues, schema });

  /** 렌더링 영역 */
  return (
    <>
      <Form {...form} formType="detail" formName="폼 실습">
        <DetailTitle title='사원정보' tableStyle={{width:'600px', tableLayout:'fixed'}}>
          <DetailRow>
            <Field name="name" 
                   type={SFType.Text} 
                   label='성명'
                   styles={{width:'150px'}}/>
            <Field name="gender" 
                   type={SFType.Radio} 
                   label="성별"
                   options={[
                    {detail_code_id: 'M', detail_code_name: '남'},
                    {detail_code_id: 'F', detail_code_name: '여'},
                   ]}/>
          </DetailRow>
          <DetailRow>
            <Field name="dept"
                   type={SFType.Selectbox}
                   label='부서'
                   options={
                    [
                      {detail_code_id: 'A001', detail_code_name: 'Framework팀'},
                      {detail_code_id: 'A002', detail_code_name: 'SIS팀'},
                    ]
                   }
                   needAlloption={true}
                   styles={{width:'150px'}}
                   colspan={2}
                   />
          </DetailRow>
          <DetailRow>
            <Field name="content"
                   type={SFType.TextArea}
                   label="업무내용"
                   styles={{width:'400px', height:'100px'}}
                   colspan={2}>
            </Field>
          </DetailRow>
        </DetailTitle>
      </Form>
    </>
  );
}
