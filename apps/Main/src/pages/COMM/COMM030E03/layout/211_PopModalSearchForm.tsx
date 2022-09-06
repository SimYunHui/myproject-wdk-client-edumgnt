import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { SFType } from "@vntgcorp/vntg-wdk-client";
import * as yup from "yup";
import { ModalForm, Field, SearchRow } from "@vntgcorp/vntg-wdk-client";

type SearchProps = {
  onSubmit?: (data: any) => void;
  ref?: React.ReactNode;
};

const ModalSearch: React.FC<SearchProps> = forwardRef(({ onSubmit }, ref) => {
  /**
   * default value 설정
   */
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
      <ModalForm
        {...form}
        onSubmit={handleSubmit}
        formType="search"
        formName="COMM030E03-Role 등록"
      >
        <SearchRow>
          <Field
            type={SFType.Text}
            label="사용자 명"
            name="search_text"
            labelStyles={{ width: "80px" }}
            styles={{ width: "100px" }}
          ></Field>
        </SearchRow>
      </ModalForm>
    </React.Fragment>
  );
});

export default ModalSearch;
