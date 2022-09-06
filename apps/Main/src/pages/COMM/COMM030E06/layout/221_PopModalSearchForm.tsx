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
    selectBox: "%",
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

  return (
    <React.Fragment>
      <Form
        {...form}
        onSubmit={handleSubmit}
        formType="search"
        formName="COMM030E06-그룹 기준 메뉴 권한 등록"
        styles={{ margin: "10px 0px 5px 0px" }}
      >
        <SearchRow>
          <Field
            label="시스템 타입"
            name="selectBox"
            type={SFType.Selectbox}
            needAlloption={true}
            //selected={selected}
            code={"AA02"}
            placeholder="전체선택"
            styles={{ width: "200px" }}
          />
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
