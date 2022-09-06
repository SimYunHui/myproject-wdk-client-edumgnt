import { getDate } from "date-fns";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useRecoilValue } from "recoil";
import { useForm } from "@vntgcorp/vntg-wdk-client";
import { User } from "@vntgcorp/vntg-wdk-client";
import { GridRow } from "@vntgcorp/vntg-wdk-client";
import {
  DetailRow,
  DetailTitle,
  Field,
  Form,
  LEField,
  SFType,
  Yup,
} from "@vntgcorp/vntg-wdk-client";
import {
  FileUploader,
  FileUploadType,
  // UPLOADERSTAT,
} from "@vntgcorp/vntg-wdk-client";
import { roleArrayState } from "@vntgcorp/vntg-wdk-client";
import { FIELD } from "./constants";
import "./notice.css";
import { UPLOADERSTAT } from "@vntgcorp/vntg-wdk-client/dist/app/src/components/molecules/FileUploader/FileUploader";

type DetailProps = {
  row: GridRow;
  empInfo: User;
  onSetGridValue: any;
  ref?: any;
};
export type GridDetailRefHandle = {
  cleanup: () => void;
  getData: () => GridRow;
};

const NoticeDetail = forwardRef<GridDetailRefHandle, DetailProps>(
  ({ row, empInfo, onSetGridValue }, ref) => {
    const [isReadOnly, setIsReadOnly] = useState<boolean>();
    const [article, setArticle] = useState<any>();
    const [fileName, setFileName] = useState<string>("");
    const userRole: Array<string> = useRecoilValue(roleArrayState);

    const defaultValues = {
      [FIELD.ARTICLE_SNO]: "",
      [FIELD.CORP_CODE]: "01",
      [FIELD.BOARD_ALL_YN]: "Y",
      [FIELD.BOARD_TYPE]: "01",
      [FIELD.BUSI_PLACE]: empInfo.busi_place,
      [FIELD.SYSTEM_TYPE]: "S01",
      [FIELD.TITLE]: "",
      [FIELD.WRITE_DATE]: "",
      [FIELD.WRITE_USER_ID]: "",
      [FIELD.WRITE_USER_NAME]: "",
      [FIELD.ARTICLE_CTNT]: "",
      [FIELD.ATTACH_GROUP_ID]: "",
      [FIELD.ROW_STAT]: "",
    };

    const schema = useMemo(() => {
      return Yup.object({
        title: Yup.string().transform((val, origVal) => {
          return origVal === "" ? null : val;
        }),
        corp_code: Yup.string(),
        busi_place: Yup.string(),
        board_all_yn: Yup.string(),
        board_type: Yup.string(),
        attach_group_id: Yup.string(),
        // write_date: Yup.string().transform_datetime(),
        write_data: Yup.string(),
        write_user_name: Yup.string(),
        article_ctnt: Yup.string(),
      });
    }, []);

    const form = useForm({ defaultValues, schema });

    useImperativeHandle(ref, () => ({
      cleanup() {
        form.reset();
      },

      getData() {
        const values = form.getValues();
        return { ...row, value: { ...article, ...values } };
      },
    }));

    useEffect(() => {
      form.reset();
      if (row === undefined || row === null) return;

      setIsReadOnly(
        row?.value.write_user_id === empInfo.user_id ||
          userRole.includes("AUTH011")
          ? false
          : true
      );
      setArticle(row.value);
      setFileName(row.value.attach_filename);

      for (const [_, key] of Object.entries(FIELD)) {
        type oKey = keyof typeof row;
        let value = row[key as oKey] as any;
        let _key = key;

        switch (key) {
          case FIELD.TITLE:
            value = value ? value : null;
            break;
          case FIELD.WRITE_DATE:
            value = value ? getDate(value) : null;
            break;
          case FIELD.WRITE_USER_ID:
            _key = "write_user_id";
            break;
          case FIELD.WRITE_USER_NAME:
            _key = "write_user_name";
            break;
          case FIELD.ATTACH_GROUP_ID:
            value = value ? value : null;
            break;
        }
        form.setValue(_key, value);
      }
    }, [row]);

    useEffect(() => {
      //article.sno 여부에 따라서 write_date의 display여부를 결정하기 때문에
      //row useEffect에서는 write_date가 rendering되지 않는 현상이 있음
      form.setValues(article);
    }, [article]);

    const fileUploaderCallback = (
      _colunmName: string,
      stat: UPLOADERSTAT,
      attachid: string
    ) => {
      if (stat === UPLOADERSTAT.NEWFILE) {
        if (attachid) {
          onSetGridValue(FIELD.ATTACH_GROUP_ID, attachid);
          form.setValue(FIELD.ATTACH_GROUP_ID, attachid);
        }
      } else if (stat === UPLOADERSTAT.DELFILE) {
        onSetGridValue(FIELD.ATTACH_GROUP_ID, null);
        form.setValue(FIELD.ATTACH_GROUP_ID, "");
      }
    };

    return (
      <div className="notice" style={{ height: "100%" }}>
        <Form
          {...form}
          formType="detail"
          formName="공지사항 상세"
          useTable="Y"
          styles={{ height: "97%", minHeight: "436px" }}
        >
          <DetailTitle
            title="공지사항"
            tableStyle={{
              width: "1200px",
              height: "90%",
              tableLayout: "fixed",
            }}
          >
            <DetailRow>
              <Field
                label="제목"
                name={"title"}
                type={SFType.Text}
                styles={{ width: "100%" }}
                colspan={article && article.article_sno !== -1 ? 3 : 3}
                readOnly={isReadOnly}
                onChange={onSetGridValue}
              />
            </DetailRow>
            <DetailRow>
              {article && article.article_sno !== -1 && (
                <Field
                  label="사업장"
                  name={"busi_place"}
                  type={SFType.Busiplace}
                  // code={'CM18'}
                  styles={{ width: 195 }}
                  readOnly={isReadOnly}
                  onChange={onSetGridValue}
                  needAlloption={false}
                ></Field>
              )}
              <Field
                label="공지 유형"
                name={"board_type"}
                type={SFType.Selectbox}
                code={"CM20"}
                styles={{ width: 195 }}
                readOnly={isReadOnly}
                onChange={onSetGridValue}
              />
              <Field
                label="시스템 타입"
                name={"system_type"}
                type={SFType.Selectbox}
                code={"AA02"}
                colspan={article && article.article_sno !== -1 ? 1 : 2}
                // colspan={article && article.article_sno !== -1 ? 3 : 2}
                styles={{ width: 195 }}
                readOnly={isReadOnly}
                onChange={onSetGridValue}
              />
              {/* <Field
              label="비밀번호"
              name={'write_user_name'}
              type={SFType.DateRangePicker}
              styles={{ width: 200 }}
              readOnly={true}
            /> */}
            </DetailRow>
            <DetailRow>
              <Field
                label="작성자"
                name={"write_user_name"}
                type={SFType.Text}
                styles={{ width: 195, marginRight: 100 }}
                readOnly={true}
              />
              <Field
                label="작성일자"
                name={"write_date"}
                type={SFType.Text}
                mask={"datetime"}
                styles={{ width: 195 }}
                readOnly={true}
              ></Field>
              <Field
                label="게시 대상"
                name={"board_all_yn"}
                type={SFType.Selectbox}
                code={"CM21"}
                onChange={onSetGridValue}
                styles={{ width: 195 }}
                readOnly={isReadOnly}
                // onChange={emailsendConfirm}
                // disabled={disabledEmailSendBtn}
              />
            </DetailRow>
            <DetailRow>
              <Field
                label="내용"
                name={"article_ctnt"}
                type={SFType.ContentEditor}
                styles={isReadOnly ? { height: "95%" } : { height: "85%" }} // or 85(자기자신 글일때)
                colspan={article && article.article_sno !== -1 ? 3 : 3}
                readOnly={isReadOnly}
              />
            </DetailRow>
            <DetailRow>
              <LEField
                label="첨부 파일"
                colspan={article && article.article_sno !== -1 ? 3 : 3}
              >
                <FileUploader
                  type={FileUploadType.MULTIFILEINPUT}
                  styles={{ paddingBottom: "10px", width: 195 }}
                  attachID={form.getValues().attach_group_id}
                  callBack={(stat, attachid) =>
                    fileUploaderCallback(FIELD.ATTACH_GROUP_ID, stat, attachid)
                  }
                  disable={isReadOnly}
                  filename={fileName}
                />
              </LEField>
            </DetailRow>
          </DetailTitle>
        </Form>
      </div>
    );
  }
);

export const NoticeDetailPage = React.memo(NoticeDetail);
