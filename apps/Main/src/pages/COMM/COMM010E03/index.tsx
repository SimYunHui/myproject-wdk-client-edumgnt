/**
 * UI 개발 COMM010E03 사용자 관리
 * @module COMM010E03
 * 220127 승희
 */
import React, { useEffect, useRef, useState } from "react";
import Template from "./layout/Template";
import DetailForm, { DetailFormHandler } from "./layout/210_DetailForm";
import ApiCall from "./action/API";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { userInfoGlobalState } from "@vntgcorp/vntg-wdk-client";
import { useRecoilValue } from "recoil";
import { Title } from "@vntgcorp/vntg-wdk-client";
import { error, success } from "@vntgcorp/vntg-wdk-client";
import { emailRegEzp, mobileRegExp, pwdRegEzp } from "./layout/functions";
import FirstDetailGrid from "./layout/220_FirstDetailGrid";
import SecondDetailGrid from "./layout/230_SecondDetailGrid";

type Handler = {
  cleanup: () => void;
};

export default function UserInfo() {
  /**
   * Hook 선언
   */
  const formRef = useRef<Handler & DetailFormHandler>(null);
  const firstdetailgridRef = useRef<Handler>(null);
  const seconddetailgridRef = useRef<Handler>(null);
  const [, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const [selectDataRow, setSelectDataRow] = useState<any>();
  const [firstDetailRows, setFirstDetailRows] = useState([]);
  const [secondDetailRows, setSecondDetailRows] = useState([]);
  const userInfo = useRecoilValue(userInfoGlobalState);

  useEffect(() => {
    onRetrive();
  }, []);

  /**
   * 조회
   * @method onRetrive
   */
  const onRetrive = async () => {
    api.retrive({ user_id: userInfo.user_id }).then((res) => {
      formRef.current.cleanup();
      setSelectDataRow(res.data);
      formRef.current.submit();
      onRetriveFirstDetail(res);
      onRetriveSecondDetail(res);
    });
  };

  /**
   * 사용자별 그룹 목록 조회
   * @method onRetriveFirstDetail
   */
  const onRetriveFirstDetail = (data: any) => {
    const param = {
      user_id: userInfo.user_id,
    };
    api.retriveFirstDetail(param).then((res) => {
      setFirstDetailRows(res.data);
    });
    return data;
  };

  /**
   * 사용자별 Role 목록 조회
   * @method onRetriveFirstDetail
   */
  const onRetriveSecondDetail = (data: any) => {
    const param = {
      user_id: userInfo.user_id,
    };
    api.retriveSecondDetail(param).then((res) => {
      setSecondDetailRows(res.data);
    });
    return data;
  };

  /**
   * 공통 기능 저장
   * @method onSave
   */
  const onSave = async () => {
    const formData = formRef.current.getValues();

    formData.row_stat = "modified";

    [formData].map((item) => {
      for (const key in item) {
        type ObjectKey = keyof typeof item;
        if (
          item[key as ObjectKey] === undefined ||
          item[key as ObjectKey] === ""
        ) {
          //@ts-ignore
          item[key] = null;
        }
      }

      return item;
    });

    try {
      // 비밀번호
      const pwd = formData.pwd_new;
      if (pwd) {
        // 비밀번호 형식 체크
        if (pwd && !pwdRegEzp.test(pwd)) {
          throw new Error(
            "[비밀번호] 영문/숫자/특수문자(~, !, @, $, ^, * 만 사용 가능)를 조합하여 최소 8자 이상 20자 이내 대소문자를 구별하여 입력하세요."
          );
        }

        // 새 비밀번호와 새 비밀번호 확인 비교
        const pwd_chk = formData.pwd_chk;
        if (pwd != pwd_chk) {
          throw new Error(
            "[비밀번호] 새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다."
          );
        }
      }

      // 이메일 형식 체크
      const emailAddr = formData.email;
      if (emailAddr && !emailRegEzp.test(emailAddr)) {
        throw new Error("[이메일] 올바른 이메일 형식으로 입력하세요.");
      }

      // 휴대전화번호 형식 체크
      const mobileNo = formData.mobile_no;
      if (mobileNo && !mobileRegExp.test(mobileNo)) {
        throw new Error("[휴대전화번호] 000-0000-0000 형식으로 입력하세요.");
      }

      const result = await api.save([formData]);
      if (!result.success) {
        throw new Error(result.message);
      } else {
        if (pwd) {
          if (result.data == "false") {
            console.log("🐥 pwd 변경 🐥");
            throw new Error("[비밀번호] 현재 비밀번호를 다시 입력하세요.");
          }
        }
        console.log("🐣 pwd 미변경 🐣");
        onRetrive();
        success("저장 되었습니다.");
      }
    } catch (err) {
      error(err);
    }
  };

  return (
    <>
      {/**  공통 Title Component
       * @param {function} onCleanup 공통 초기화버튼
       * @param {function} onSave 공통 저장버튼
       * @param {function} onRetrive 공통 조회버튼
       */}
      <Template
        title={
          <Title
            useCleanup={false}
            useRetrive={false}
            onSave={onSave}
            useSave={true}
          ></Title>
        }
        topContent={<DetailForm rowdata={selectDataRow} ref={formRef} />}
        bottomLeftContent={
          <FirstDetailGrid
            title="사용자별 그룹 목록"
            originRows={firstDetailRows}
            ref={firstdetailgridRef}
          />
        }
        bottomRightContent={
          <SecondDetailGrid
            title="사용자별 Role 목록"
            originRows={secondDetailRows}
            ref={seconddetailgridRef}
          />
        }
      ></Template>
    </>
  );
}
