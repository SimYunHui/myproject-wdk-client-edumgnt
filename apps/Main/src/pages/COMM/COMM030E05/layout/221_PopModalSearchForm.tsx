/**
 * UI 개발 Search Box Template
 *
 * @module SearchForm
 
 */
import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { Field, Form, SearchRow, SFType } from "@vntgcorp/vntg-wdk-client";
/**
 * Search Component
 */
type SearchProps = {
  onSubmit?: any;
};
export const ModalSearch = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /////////////////////////////////////////////////////////////
  // default value 설정
  /////////////////////////////////////////////////////////////
  const defaultValues = {
    searchText: "",
  };
  /////////////////////////////////////////////////////////////
  // useForm hook
  /////////////////////////////////////////////////////////////
  const form = useForm({ defaultValues });

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
        styles={{ margin: "5px 0px 5px 0px" }}
      >
        <SearchRow>
          <Field
            label="사용자 ID/명"
            name="searchText"
            type={SFType.Text}
            needAlloption={true}
            placeholder="입력하세요."
            styles={{ width: "100px" }}
          ></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
