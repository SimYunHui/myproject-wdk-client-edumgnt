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

export type SearchRefHandle = {
  cleanup: () => void;
  submit: () => void;
};

export const Search = forwardRef<SearchRefHandle, SearchProps>(
  ({ onSubmit }: SearchProps, ref) => {
    /////////////////////////////////////////////////////////////
    // default value 설정
    /////////////////////////////////////////////////////////////
    const defaultValues = {
      search_text: "",
    };

    /**
     * validation schema
     */
    const schema = useMemo(() => {
      return yup.object({
        search_text: yup.string(),
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
          formName="COMM030E06-그룹 기준 메뉴 권한 등록"
        >
          <SearchRow>
            <Field
              label="그룹명"
              name="search_text"
              type={SFType.Text}
              placeholder="입력해주세요."
            />
          </SearchRow>
        </Form>
      </React.Fragment>
    );
  }
);
