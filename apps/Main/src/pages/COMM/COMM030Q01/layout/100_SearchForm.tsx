/**
 * UI 개발 Search Box Template
 *
 * @module SearchForm
 * 211124 Pang
 */
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useForm }  from "@vntgcorp/vntg-wdk-client";
import { Field, Form, SearchRow, SFType } from "@vntgcorp/vntg-wdk-client";
import * as yup from 'yup';
/**
 * Search Component
 */
type SearchProps = {
  onSubmit?: (data: any, noneFlag?: any) => void;
};
export const Search = forwardRef(({ onSubmit }: SearchProps, ref) => {
  /////////////////////////////////////////////////////////////
  // default value 설정
  /////////////////////////////////////////////////////////////
  const defaultValues = {
    searchText: '',
  };
  const schema = useMemo(() => {
    return yup.object({
      searchText: yup.string(),
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
      <Form {...form} onSubmit={handleSubmit} formType="search" formName="COMM030EQ01-사용자별 메뉴 조회">
        <SearchRow>
          <Field
            label="사용자ID/명"
            name="searchText"
            type={SFType.Text}
            placeholder="입력해주세요."
            styles={{ margin: '0 0 0 10px' }}
          />
        </SearchRow>
      </Form>
    </React.Fragment>
  );
});
