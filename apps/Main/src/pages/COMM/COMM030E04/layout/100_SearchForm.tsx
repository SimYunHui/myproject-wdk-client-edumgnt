import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { Form, Field, SearchRow } from "@vntgcorp/vntg-wdk-client";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { SFType } from "@vntgcorp/vntg-wdk-client";
import * as yup from "yup";

type SearchProps = {
  onSubmit?: (data: any) => void;
};

export const Search = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /**
   * default value 설정
   */
  const defaultValues = {
    search_text: "",
    user_level: "%",
    use_yn: "Y",
  };

  /**
   *
   */
  const useynOptions = [
    {
      detail_code_id: "Y",
      detail_code_name: "미사용 사용자 포함",
    },
  ];

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
        formName="COMM030E04-사용자 Role 등록"
      >
        <SearchRow>
          <Field
            type={SFType.Text}
            label="사용자 ID/사용자 명"
            name="search_text"
            styles={{ width: "100px" }}
          ></Field>
          <Field
            type={SFType.Selectbox}
            label="레벨"
            name="user_level"
            needAlloption={true}
            code={"AA03"}
          ></Field>
          <Field
            type={SFType.Checkbox}
            label=""
            name="use_yn"
            options={useynOptions}
          ></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
