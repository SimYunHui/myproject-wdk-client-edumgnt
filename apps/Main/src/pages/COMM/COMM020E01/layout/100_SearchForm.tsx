import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { SFType } from "@vntgcorp/vntg-wdk-client";
import * as yup from "yup";
import { Form, Field, SearchRow } from "@vntgcorp/vntg-wdk-client";
import { SearchProps } from "../util/Types";

export const Search = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /**
   * default value 설정
   */
  const defaultValues = {
    search_text: "",
    parent_code_type_id: "",
    system_yn: "%",
  };

  /**
   * validation schema
   */
  const schema = useMemo(() => {
    return yup.object({
      search_text: yup.string(),
    });
  }, []);

  /**
   * useForm hook
   */
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

  return (
    <React.Fragment>
      <Form
        {...form}
        onSubmit={handleSubmit}
        formType="search"
        formName="COMM020E01-공통코드 관리"
      >
        <SearchRow>
          <Field
            type={SFType.Text}
            label="공통 코드 유형 명"
            labelStyles={{ width: 110 }}
            name="search_text"
            styles={{ width: "100px" }}
          ></Field>
          <Field
            type={SFType.Text}
            label="상위 공통 코드 ID"
            labelStyles={{ width: 110 }}
            name="parent_code_type_id"
            styles={{ width: "100px" }}
          ></Field>
          <Field
            type={SFType.Selectbox}
            label="시스템 여부"
            labelStyles={{ width: 110 }}
            name="system_yn"
            placeholder="전체선택"
            needAlloption={true}
            code={"CM28"}
          ></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
