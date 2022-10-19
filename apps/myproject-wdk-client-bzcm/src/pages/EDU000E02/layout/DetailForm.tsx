import { DetailRow, DetailTitle, ESGrid, Field, Form, getDate, SFType, useForm } from '@vntgcorp/vntg-wdk-client';
import { clear } from 'console';
import React from 'react';
import { DefaultValue } from 'recoil';
import MasterGrid from 'src/pages/BZCM020E10/layout/MasterGrid';
import * as yup from 'yup';

type DetailFormProps = {
  onChangeData: (name: string, value: string) => void;
};

type DetailFormForwardFunc = {
  cleanup: () => void;
  submit: () => any;
  changeData: (any) => void;
};

const DetailForm = React.forwardRef<DetailFormForwardFunc, DetailFormProps>(({ onChangeData }, ref) => {
  React.useImperativeHandle(ref, () => ({
    cleanup() {
      // 초기화 함수
      form.reset();
      form.setValue('use_yn@@Y', null);
    },
    submit() {
      // 제출 함수 호출
      //   console.log(detailGridRef.current.getData());
    },
    changeData(value) {
      //const date = new Date(value.report_write_date);

      const date = new Date(value.report_write_date);
      value.report_write_date = getDate(date.toString());

      form.setValues(value);

      form.setValue('use_yn@@Y', value.use_yn);
    },
  }));

  const form = useForm({});
  /*
   * Rendering mount 시 초기화
   */

  const onElementChange = (e) => {
    //e.stopPropagation();
    console.log(e.target);
    onFieldChange(e.target.name, e.target.value);
  };

  const onFieldChange = (name, value) => {
    if (name == 'use_yn@@Y') {
      const inputData = name.split('@@');
      onChangeData(inputData[0], value);
    } else {
      onChangeData(name, value);
    }
  };

  const useynOptions = [{ detail_code_id: 'Y', detail_code_name: '' }];

  return (
    <React.Fragment>
      <Form {...form} formType="detail" formName="EDU000E02-사원등록" useTable="Y">
        <DetailTitle title="사원 정보">
          <DetailRow>
            <Field
              label="ID"
              name={'user_id'}
              labelStyles={{ width: '200px' }}
              onChange={onElementChange}
              type={SFType.Text}
            />
            <Field
              label="사원번호"
              name={'emp_no'}
              labelStyles={{ width: '200px' }}
              onChange={onElementChange}
              type={SFType.Text}
              required={true}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="성명"
              name={'emp_name'}
              labelStyles={{ width: '200px' }}
              onChange={onElementChange}
              type={SFType.Text}
            />
            <Field
              label="전화번호"
              name={'phon_number'}
              labelStyles={{ width: '200px' }}
              onChange={onElementChange}
              type={SFType.Text}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="부서코드"
              name={'dept_code'}
              labelStyles={{ width: '200px' }}
              onChange={onFieldChange}
              type={SFType.Selectbox}
              code={'CM10'}
              styles={{ width: '200px' }}
              colspan={3}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="직무"
              name={'job'}
              labelStyles={{ width: '200px' }}
              onChange={onFieldChange}
              type={SFType.Selectbox}
              code={'CM31'}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="직책"
              name={'responsi'}
              labelStyles={{ width: '200px' }}
              onChange={onFieldChange}
              type={SFType.Selectbox}
              code={'CM27'}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="이메일"
              name={'email'}
              labelStyles={{ width: '200px' }}
              onChange={onElementChange}
              type={SFType.Text}
              styles={{ width: '200px' }}
              colspan={3}
            />
          </DetailRow>
          <DetailRow>
            <Field
              label="사용여부"
              name={'use_yn'}
              labelStyles={{ width: '200px' }}
              type={SFType.Checkbox}
              options={useynOptions}
              onChange={onFieldChange}
            />
          </DetailRow>
        </DetailTitle>
      </Form>
    </React.Fragment>
  );
});

export default DetailForm;
