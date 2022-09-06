import {
    Field,
    Form,
    getDate,
    SearchRow,
    SFType,
    useForm,
  } from "@vntgcorp/vntg-wdk-client";
  import React from "react";
  import * as yup from "yup";
  
type SearchFormProps = {};
export type SearchFormForwardFunc = {
  cleanup: () => void;
  submit: () => void;
};

const SearchForm = React.forwardRef<SearchFormForwardFunc, SearchFormProps>(
  ({}, ref) => {
    /**
     *  Forward Ref 를 통한 이벤트 선언부 
    */ 
     React.useImperativeHandle(ref, () => ({
        cleanup() { // 초기화 함수
          form.reset();
        },
        submit() { // 보내기 함수
          console.log('seachForm submit');
          return form.getValues();
        },
      }));
    
    /**
     * default value 설정
     */
     const date = new Date();
     const y = date.getFullYear();
     const m = date.getMonth();
     const firstDay = new Date(y, m, 1).toString();
     const lastDay = new Date(y, m + 1, 0).toString();
     const defaultDate = {
       from: getDate(firstDay),
       to: getDate(lastDay),
     };
     /**
      * default value 설정
      */
     const defaultValues = {
       DATARANGE_start: defaultDate.from,
       DATARANGE_end: defaultDate.to,
     };

    /**
     * useForm hook
     */
    const form = useForm({ defaultValues });
    
    return (
      <React.Fragment>
        <Form {...form} formType="search" formName="BZCM020E10-업무일지">
          <SearchRow>
            <Field type={SFType.DateRangePicker}
                   label={"등록일자"}
                   name={"DATARANGE"}>
            </Field>
            <Field type={SFType.Text} 
                   name={"EMP_NAME"} 
                   label={"담당자"}>
            </Field>
          </SearchRow>
        </Form>
      </React.Fragment>
    );
  }
);
export default SearchForm;