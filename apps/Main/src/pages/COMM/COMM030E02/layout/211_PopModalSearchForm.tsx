/**
 * UI 개발 Search Box Template
 *
 * @module SearchForm
 
 */
import { useForm } from "@vntgcorp/vntg-wdk-client";
import _ from "lodash";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { SFType } from "@vntgcorp/vntg-wdk-client";
import { Form, Field, SearchRow } from "@vntgcorp/vntg-wdk-client";
import * as yup from "yup";
/**
 * Search Component
 */
export type ModalSearchHandler = {
  submit: () => void;
};

type SearchProps = {
  onSubmit?: any;
};
export const ModalSearch = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /////////////////////////////////////////////////////////////
  // default value 설정
  /////////////////////////////////////////////////////////////
  const defaultValues = {
    searchText: "",
    selectBox: "%",
  };
  const schema = useMemo(() => {
    return yup.object({
      selectBox: yup.string(),
    });
  }, []);
  /////////////////////////////////////////////////////////////
  // useForm hook
  /////////////////////////////////////////////////////////////
  const form = useForm({ defaultValues, schema });

  const handleSubmit = form.handleSubmit(onSubmit);

  useImperativeHandle(ref, () => ({
    cleanup() {
      form.reset();
    },
    submit() {
      handleSubmit();
    },
  }));
  /**
   * Custom option
   */

  return (
    <React.Fragment>
      <Form
        {...form}
        onSubmit={handleSubmit}
        formType="search"
        formName="COMM030E02-메뉴 등록"
        styles={{ margin: "5px 0px 5px 0px" }}
      >
        <SearchRow>
          <Field
            label="시스템 코드"
            name="selectBox"
            type={SFType.Selectbox}
            needAlloption={true}
            code={"AA01"}
          ></Field>
          <Field
            label="프로그램ID/명"
            name="searchText"
            type={SFType.Text}
            placeholder="입력하세요."
            styles={{ width: "250px" }}
            labelStyles={{ maxWidth: "100px", textAlign: "left" }}
          ></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
