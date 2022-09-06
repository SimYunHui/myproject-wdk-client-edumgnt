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
type SearchProps = {
  onSubmit?: any;
};
export const Search = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /////////////////////////////////////////////////////////////
  // default value 설정
  /////////////////////////////////////////////////////////////
  const defaultValues = {
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
        formName="COMM030E05-메뉴 권한 등록"
      >
        <SearchRow>
          <Field
            label="시스템 타입"
            name="selectBox"
            type={SFType.Selectbox}
            needAlloption={true}
            code={"AA02"}
            placeholder="전체선택"
            styles={{ width: "200px" }}
          />
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
