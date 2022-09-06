/**
 * 공지사항
 * @module Notice
 * @author bum
 */
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
// import { PageProps } from "../../App";
// import { useFileupload } from "../../common/hook/useFileUpload";
import {
  GridRow,
  info,
  IResData,
  Notify,
  TabContent,
  TabRefHandle,
  Title,
  useFileupload,
  userInfoGlobalState,
  useSyncHttpCient,
  warning,
} from "@vntgcorp/vntg-wdk-client";
// import { GridRow } from "../../common/utils/ESGrid/type";
// import { Notify } from "../../common/utils/notification";
// import { info, warning } from "../../common/utils/toast";
// import { TabContent, TabRefHandle, Title } from "../../components";
// import { userInfoGlobalState } from "../../state/userInfoGlobalState";
import ApiCall from "./action/API";
import { Search, SearchRefHandle } from "./layout/100_SearchForm";
import { NoticeGrid, setGridValue } from "./layout/200_NoticeGrid";
import {
  GridDetailRefHandle,
  NoticeDetailPage,
} from "./layout/300_NoticeDetail";
import Template from "./layout/Template";

type ScreenParam = {
  article_sno: string;
};

type TitleProps = {
  useSave?: boolean;
  useRetrive?: boolean;
  useCleanup?: boolean;
  useExport?: boolean;
  useUpload?: boolean;
};
export default function Notice() {
  /**
   * Hook 선언
   * *
   */
  const [titleBtn, setTitleBtn] = useState<TitleProps>({
    useCleanup: true,
    useSave: true,
    useRetrive: true,
  });
  const [, fetchRequest] = useSyncHttpCient<IResData>();
  const [api] = useState(new ApiCall(fetchRequest));
  const empInfo = useRecoilValue(userInfoGlobalState);
  const [noticeList, setNoticeList] = useState(null);
  const [noticeArticle, setNoticeArticle] = useState<GridRow>();
  const _fileuploader = useFileupload();

  useEffect(() => {
    onRetrive("N");

    // if (props.screenParam) {
    //   onSelectNoticeRow(props.screenParam);
    // }

    return () => {
      _fileuploader.fileDataClear();
    };
  }, []);
  /*`
   * Ref
   */
  const searchRef = useRef<SearchRefHandle>(null);
  const tabRef = useRef<TabRefHandle>();

  /**
   * 공통버튼 부분
   */
  const onSave = () => {
    const activeTab = tabRef.current.tab();

    let rData = (activeTab as GridDetailRefHandle).getData();
    if (!rData || (Array.isArray(rData) && rData.length === 0)) {
      info("저장할 데이터가 없습니다");
      return;
    }
    let data;
    if (!Array.isArray(rData)) {
      let rowData = rData as GridRow;
      data = [rowData.value];
    } else {
      data = rData;
    }

    for (const idx in data) {
      let params = { ...data[idx] };
      params["delete_yn"] = "N";
      params["pwd"] = "";
      params["pwd_use_yn"] = "";

      if (data[idx].__rowState && data[idx].__rowState === "deleted") {
        params["row_stat"] = "deleted";
      } else if (data[idx].first_rg_yms) {
        params["row_stat"] = "modified";
      } else {
        params["row_stat"] = "added";
      }
      api.saveNotice(params).then((res) => {
        if (res.success) {
          Notify.update();

          if (params["row_stat"] !== "deleted") _fileuploader.onSave();
          onRetrive();

          tabRef.current.setActiveTab(TABS.LIST);
          setTitleBtn({ ...titleBtn, useSave: true, useRetrive: true });
        } else warning(res.message);
      });
    }
  };

  const onRetrive = (msgYn = "Y") => {
    const params = searchRef.current.getData();
    const searchParam = {
      busi_place: params["busi_place"] || "%",
      corp_code: params["corp_code"] || empInfo.corp_code,
      board_all_yn: params["board_all_yn"] || "%",
      board_type: params["board_type"] || "%",
      title: params["title"] || "%",
      system_type: params["system_type"] || empInfo.system_type,
      write_user_name: params["write_user_name"] || "%",
      write_date_fr: params["write_date_start"]
        ? params["write_date_start"].replace(/-/g, "")
        : "%",
      write_date_to: params["write_date_end"]
        ? params["write_date_end"].replace(/-/g, "")
        : "%",
    };
    api.retriveNoticeList(searchParam).then((res) => {
      if (res.success) {
        if (!res.data) {
          setNoticeList([]);
          Notify.notfound("공지사항");
          return;
        }
        setNoticeList(res.data);
        if (msgYn !== "N") Notify.retrive();
      } else {
        warning(res.message);
      }
    });
  };
  /**
   * 초기화
   */
  const onCleanup = () => {
    setNoticeList(null);
    setNoticeArticle(null);
    searchRef.current.cleanup();
    tabRef.current.cleanup();
    setTitleBtn({ ...titleBtn, useSave: true, useRetrive: true });
    info("초기화되었습니다.");
    _fileuploader.fileDataClear();
  };

  // handle Submit
  const onSubmit = (object: any) => {
    console.log("handle submit action :: ", object);
  };

  const enum TABS {
    LIST = 0,
    DETAIL = 1,
  }
  const handleTab = (tabIndex: number) => {
    if (noticeArticle === null || noticeArticle === undefined) return false;

    if (tabIndex === TABS.LIST) {
      setTitleBtn({ ...titleBtn, useSave: true, useRetrive: true });
    } else if (tabIndex === TABS.DETAIL) {
      setTitleBtn({ ...titleBtn, useSave: true, useRetrive: false });
    }
    return true;
  };

  const onSelectNoticeRow = (row: any) => {
    if (typeof row !== "object") {
      row = {
        _row: undefined,
        value: {
          article_sno: row,
        },
      };
    }
    if (row.value.article_sno === "0000") {
      return;
    }

    if (row.value.article_sno == -1) {
      moveDetailTab(row);
      return;
    }

    api.retriveNoticeArticle(row.value.article_sno).then((res) => {
      row.value = res.data[0];
      moveDetailTab(row);
    });
  };

  const onClickNoticeRow = (row: any) => {
    if (typeof row !== "object") {
      row = {
        _row: undefined,
        value: {
          article_sno: row,
        },
      };
    }
    if (row.value.article_sno === "0000") {
      return;
    }

    if (row.value.article_sno == -1) {
      moveDetailTab(row);
      return;
    }
    api.retriveNoticeArticle(row.value.article_sno).then((res) => {
      row.value = res.data[0];
      setNoticeArticle(row);
    });
  };

  const onSetGridValue = (name: string, value: string) => {
    console.log(typeof name, typeof value);
    const _value = value || null;
    const _name = name;

    if (typeof _name === "object") {
      //setGridValue('emp_name', _name.emp_name);
    } else {
      setGridValue(_name, _value);
    }
  };

  const moveDetailTab = (row: GridRow) => {
    setNoticeArticle(row);

    tabRef.current.setActiveTab(TABS.DETAIL);
    setTitleBtn({ ...titleBtn, useSave: true, useRetrive: false });
  };
  return (
    <>
      <Template
        title={
          <Title
            onSave={onSave}
            onRetrive={onRetrive}
            onCleanup={onCleanup}
            control={titleBtn}
          ></Title>
        }
        conditionForm={<Search onSubmit={onSubmit} ref={searchRef}></Search>}
        content={
          <TabContent
            ref={tabRef}
            alwaysDraw={true}
            tabObjList={[
              {
                index: TABS.LIST,
                id: "list",
                tabitemName: "공지사항 목록",
                src: (
                  <NoticeGrid
                    onClickRow={onClickNoticeRow}
                    onSelectRow={onSelectNoticeRow}
                    moveDetail={moveDetailTab}
                    rows={noticeList}
                    empInfo={empInfo}
                  />
                ),
              },
              {
                index: TABS.DETAIL,
                id: "detail",
                tabitemName: "공지사항 등록/상세",
                src: (
                  <NoticeDetailPage
                    row={noticeArticle}
                    empInfo={empInfo}
                    onSetGridValue={onSetGridValue}
                  />
                ),
              },
            ]}
            beforeTabChage={handleTab}
          />
        }
      />
    </>
  );
}
