import React, { useRef, useState } from "react";
import ApiCall from "../action/API";
import { ModalTitle } from "@vntgcorp/vntg-wdk-client";
import PopGrid from "./221_PopModalGrid";
import '../../../../css/programSearchModal.css';
import { ModalSearch } from "./221_PopModalSearchForm";
import { warning } from "@vntgcorp/vntg-wdk-client";
import _ from "lodash";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { ModalHandler, SearchHandler } from "../util/Types";
type PopModalProps = {
  onModalClose?: any;
  onRetrive?: any;
  dataList?: any;
  form?: any;
  selectDataValue?: any;
  ref?: any;
};

const PopSubModal: React.FC<PopModalProps> = ({
  onModalClose,
  selectDataValue,
}) => {
  const gridRef = useRef<ModalHandler>(null);
  const modalSearchRef = useRef<SearchHandler>(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [userModalRows, setUserModalRows] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));

  const [dataRow, setDataRow] = useState();
  /**
   * Form Hook useForm 선언
   */

  const selectRow = (data: any) => {
    onModalClose();
    setModalVisible(false);
    selectDataValue(data);
  };

  const onClose = () => {
    onModalClose();
    setModalVisible(false);
  };
  /**
   * 조회
   */
  type FormProps = {
    searchText: string;
    useYn: string;
    modalSelectBox: string;
  };

  const onSubmit = (data: FormProps) => {
    console.log("first modal index page onSubmit 🎃>> ", data);
    /**
     * search_text: 그룹 명
     */
    const searchvalue = {
      search_text: data.searchText,
      use_yn: data.useYn,
      user_level: data.modalSelectBox,
    };

    api.retriveUserModal(searchvalue).then((res) => {
      setUserModalRows(res);
    });
  };
  // const onSelect = () => {
  //   if (dataRow) {
  //     onModalClose();
  //     setModalVisible(false);
  //     selectDataValue(dataRow);
  //     console.log('dataRow: ', dataRow);
  //   } else {
  //     alert('사용자를 선택 해 주세요!');
  //   }
  // };
  const onConfirm = () => {
    const tempData = gridRef.current.confirm();
    if (_.isEmpty(tempData)) {
      warning("선택된 데이터가 없습니다.");
      return;
    }
    selectRow(tempData);
    onModalClose();
    setModalVisible(false);
  };
  const onRetriveData = () => {
    modalSearchRef.current.submit();
  };

  const Cleanup = () => {
    gridRef.current.cleanup();
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
            title="사용자 조회"
            useRetrive={true}
            useConfirm={true}
            useClose={true}
            useCleanup={true}
            onConfirm={onConfirm}
            onCleanup={Cleanup}
            onRetrive={onRetriveData}
            onClose={onClose}
          ></ModalTitle>
          <main>
            <ModalSearch onSubmit={onSubmit} ref={modalSearchRef}></ModalSearch>

            <PopGrid
              originRows={userModalRows}
              onSelectRow={selectRow}
              ref={gridRef}
            ></PopGrid>
          </main>
        </section>
      )}
    </div>
  );
};
export default PopSubModal;
