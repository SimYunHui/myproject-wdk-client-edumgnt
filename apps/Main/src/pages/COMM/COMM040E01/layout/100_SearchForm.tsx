import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { SFType }  from "@vntgcorp/vntg-wdk-client";
import * as yup from 'yup';
import { Form, Field, SearchRow }  from "@vntgcorp/vntg-wdk-client";

export type SearchHandler = {
  submit: () => void;
};

type SearchProps = {
  onSubmit?: (data: any, noneFlag?: any) => void;
};

export const Search = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /**
   * default value 설정
   */
  const defaultValues = {
    search_text: '',
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
      <Form {...form} onSubmit={handleSubmit} formType="search" formName="COMM040E01-법인 정보 등록">
        <SearchRow>
          <Field
            type={SFType.Text}
            label="법인 명/비고"
            labelStyles={{ width: 100 }}
            name="search_text"
            styles={{ width: '100px' }}
          ></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
