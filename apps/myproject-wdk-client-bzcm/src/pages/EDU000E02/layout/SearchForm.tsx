import { Field, Form, getDate, SearchRow, SFType, useForm } from '@vntgcorp/vntg-wdk-client';
import React from 'react';
import * as yup from 'yup';

type SearchFormProps = {};
export type SearchFormForwardFunc = {
  cleanup: () => void;
  submit: () => void;
};

const SearchForm = React.forwardRef<SearchFormForwardFunc, SearchFormProps>(({}, ref) => {
  /**
   *  Forward Ref 를 통한 이벤트 선언부
   */
  React.useImperativeHandle(ref, () => ({
    cleanup() {
      // 초기화 함수
      form.reset();
    },
    submit() {
      // 보내기 함수
      console.log('seachForm submit');
      return form.getValues();
    },
  }));

  /**
   * useForm hook
   */
  const form = useForm({});

  // search form은 SearchRow에 대한 type, name, label만 기술해준다 (조회 파라미터로 사용할 것들)
  // 나머지 복붙
  return (
    <React.Fragment>
      <Form {...form} formType="search" formName="EDU000E02-사원등록">
        <SearchRow>
          <Field
            type={SFType.Selectbox}
            name={'DEPT_CODE'}
            label={'부서코드'}
            code={'CM10'}
            needAlloption={true}
          ></Field>
          <Field type={SFType.Text} name={'EMP_NAME'} label={'성명'}></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
export default SearchForm;
