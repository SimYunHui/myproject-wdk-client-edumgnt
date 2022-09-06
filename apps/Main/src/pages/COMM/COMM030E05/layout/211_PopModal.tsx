import _ from "lodash";
import React, { useRef, useState } from "react";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { warning } from "@vntgcorp/vntg-wdk-client";
import { ModalTitle } from "@vntgcorp/vntg-wdk-client";
import { ModalHandler, SearchHandler } from "../util/Types";
import '../../../../css/programSearchModal.css';
import ApiCall from "./../action/API";
import PopGrid from "./211_PopModalGrid";
import { ModalSearch } from "./211_PopModalSearchForm";
type PopModalProps = {
  onModalClose?: any;
  onRetrive?: any;
  dataList?: any;
  selectDataValue?: any;
  ref?: any;
};

const PopModal: React.FC<PopModalProps> = ({
  onModalClose,
  selectDataValue,
}) => {
  const gridRef = useRef<ModalHandler>(null);
  const modalSearchRef = useRef<SearchHandler>(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [modalRows, setModalRows] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));

  const selectRow = (data: any) => {
    onModalClose();
    setModalVisible(false);
    selectDataValue(data);
    console.log(data);
  };

  const onClose = () => {
    onModalClose();
    setModalVisible(false);
  };

  const onRetriveData = () => {
    modalSearchRef.current.submit();
  };

  /**
   * 조회
   */
  type FormProps = {
    searchText: string;
  };

  const onSubmit = (data: FormProps) => {
    console.log("first modal index page onSubmit 🎃>> ", data);
    /**
     * search_text: 그룹 명
     */
    const searchvalue = {
      search_text: data.searchText,
    };

    api.retriveGroupModal(searchvalue).then((res) => {
      setModalRows(res);
    });
  };

  const Cleanup = () => {
    gridRef.current.cleanup();
    modalSearchRef.current.cleanup();
  };
  const onConfirm = () => {
    const tempData = gridRef.current.confirm();
    console.log(tempData);
    if (_.isEmpty(tempData)) {
      warning("선택된 데이터가 없습니다.");
      return;
    }
    selectRow(tempData);
    onModalClose();
    setModalVisible(false);
  };
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div
      className={
        modalVisible ? "openModal programSearchModal" : "programSearchModal"
      }
    >
      {modalVisible && (
        <section>
          <ModalTitle
            title="그룹 조회"
            useRetrive={true}
            useConfirm={true}
            useCleanup={true}
            useClose={true}
            onCleanup={Cleanup}
            onConfirm={onConfirm}
            onRetrive={onRetriveData}
            onClose={onClose}
          ></ModalTitle>
          <main>
            <ModalSearch onSubmit={onSubmit} ref={modalSearchRef}></ModalSearch>
            <PopGrid
              originRows={modalRows}
              onSelectRow={selectRow}
              ref={gridRef}
            ></PopGrid>
          </main>
        </section>
      )}
    </div>
  );
};
export default PopModal;
