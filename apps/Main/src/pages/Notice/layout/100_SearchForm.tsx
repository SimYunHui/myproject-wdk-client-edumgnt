/**
 * 공지사항
 *  - 검색 박스
 *
 * @module SearchForm
 * @author bum
 */
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { Field, Form, SearchRow, SFType, Yup } from "@vntgcorp/vntg-wdk-client";
import { userInfoGlobalState } from "@vntgcorp/vntg-wdk-client";
/**
 * Search Component
 */
type RowObject = {
  [key: string]: any;
};
type SearchProps = {
  onSubmit?: any;
};
export type SearchRefHandle = {
  cleanup: () => void;
  submit: () => void;
  getData: () => RowObject;
};

export const Search = forwardRef<SearchRefHandle, SearchProps>(
  ({ onSubmit }, ref) => {
    // eslint-disable-next-line no-empty-pattern
    // const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
    const empInfo = useRecoilValue(userInfoGlobalState);
    const defaultValues = {
      busi_place: empInfo.busi_place ? empInfo.busi_place : "%",
      system_type: empInfo.system_type,
      // board_all_yn: 'Y',
    };
    const schema = useMemo(() => {
      return Yup.object({});
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
      getData() {
        return form.getValues();
      },
    }));

    return (
      <React.Fragment>
        <Form
          {...form}
          onSubmit={handleSubmit}
          formType="search"
          formName="공지사항검색"
        >
          <SearchRow>
            <Field
              label="사업장"
              name="busi_place"
              type={SFType.Busiplace}
              // code={'CM18'}
              styles={{ width: "100px" }}
              labelStyles={{ width: "7%" }}
              role={["AUTH001", "AUTH003"]}
              needAlloption
            />
            <Field
              label="시스템 타입"
              name={"system_type"}
              type={SFType.Selectbox}
              code={"AA02"}
              labelStyles={{ width: "14%" }}
              styles={{ width: "190px" }}
              role={["AUTH001", "AUTH003"]}
              needAlloption
            />
            <Field
              type={SFType.Selectbox}
              needAlloption
              label="게시 대상"
              name="board_all_yn"
              options={[
                { detail_code_id: "Y", detail_code_name: "전사" },
                { detail_code_id: "N", detail_code_name: "해당 사업장" },
              ]}
              labelStyles={{ width: "14%" }}
              styles={{ width: "120px" }}
            />
          </SearchRow>
          <SearchRow>
            <Field
              label="공지 유형"
              name={"board_type"}
              type={SFType.Selectbox}
              code={"CM20"}
              labelStyles={{ width: "10%" }}
              styles={{ width: "100px" }}
              role={["AUTH001", "AUTH003"]}
              needAlloption
            />
            <Field
              label="작성일자"
              name="write_date"
              type={SFType.DateRangePicker}
              labelStyles={{ width: "25%" }}
            />
            <Field
              label="작성자"
              name="write_user_name"
              type={SFType.Text}
              labelStyles={{ width: "20%" }}
            />
          </SearchRow>
          <SearchRow>
            <Field
              label="제목"
              name="title"
              type={SFType.Text}
              styles={{ width: "100%" }}
              colspan={5}
            />
          </SearchRow>
        </Form>
      </React.Fragment>
    );
  }
);
