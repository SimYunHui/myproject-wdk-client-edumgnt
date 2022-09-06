import React, { forwardRef, useImperativeHandle } from "react";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { Field, Form, SearchRow, SFType } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "./constants";
import { ForwardFunc, SearchProps } from "./Types";
import { searchValidation } from "./validations";
// import ConfirmModal from "@vntgcorp/vntg-wdk-client/dist/app/src/components/ConfirmModal";

const Search = forwardRef<ForwardFunc, SearchProps>(
  ({ onChangeBusiCode, defaultBusiCode, onSubmit }, ref) => {
    /* search fields default value */
    const defaultValues = {
      [FIELD.BUSI_PLACE]: defaultBusiCode,
      [FIELD.EMP_NAME]: "",
    };
    const form = useForm({ defaultValues, schema: searchValidation });
    let handleSubmit = form.handleSubmit(onSubmit);
    useImperativeHandle(ref, () => ({
      cleanup() {
        form.reset();
      },
      submit(noneFlag?: boolean) {
        handleSubmit = form.handleSubmit((data) => {
          onSubmit(data, noneFlag);
        });
        handleSubmit();
      },
      setValues(data) {
        form.setValues(data);
      },
      getValues(name) {
        return form.getValues(name);
      },
    }));

    return (
      <React.Fragment>
        <Form
          {...form}
          onSubmit={handleSubmit}
          formType="search"
          formName="인원 등록"
        >
          <SearchRow>
            <Field
              label="사업장"
              name={FIELD.BUSI_PLACE}
              type={SFType.HObusiplace}
              styles={{ width: "100px" }}
              onChange={onChangeBusiCode}
              role={["AUTH003"]}
            />
            <Field
              label="부서/공정/직무"
              name={FIELD.TASK}
              type={SFType.Task}
              code={form.getValues("busi_place")}
              needAlloption
            />
            <Field label="성명" name={FIELD.EMP_NAME} type={SFType.Text} />
          </SearchRow>
        </Form>
      </React.Fragment>
    );
  }
);
export default Search;
