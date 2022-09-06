/**
 * UI 개발 Search Box Template
 *
 * @module SearchForm
 *
 */
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import * as yup from 'yup';
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { Field, Form, SearchRow, SFType } from "@vntgcorp/vntg-wdk-client";
/**
 * Search Component
 */
type SearchProps = {
  onSubmit?: any;
};
export const Search = forwardRef(({ onSubmit }: SearchProps, ref) => {
  const defaultValues = {
    titleText: '',
    selectBox: '%',
  };
  const schema = useMemo(() => {
    return yup.object({
      titleText: yup.string(),
    });
  }, []);

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
      <Form {...form} onSubmit={handleSubmit} formType="search" formName="COMM030E01-프로그램 정보 등록">
        <SearchRow>
          <Field
            label="시스템 코드"
            name="selectBox"
            type={SFType.Selectbox}
            needAlloption={true}
            code={'AA01'}
          ></Field>
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
