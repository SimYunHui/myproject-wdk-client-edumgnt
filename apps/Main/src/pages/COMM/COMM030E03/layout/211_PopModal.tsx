import React, { useRef, useState } from 'react';
import { ModalTitle } from '@vntgcorp/vntg-wdk-client';
import ModalSearch from './211_PopModalSearchForm';
import ModalGrid from './211_PopModalGrid';
import { SearchHandler, ModalHandler } from './Types';
import '../../../../css/programSearchModal.css';
import ApiCall from './../action/API';
import { IResData as IHttpResData, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
type PopModalProps = {
  onModalClose?: () => void;
  selectDataValue?: (data: any) => void;
};

const PopModal: React.FC<PopModalProps> = ({ onModalClose, selectDataValue }) => {
  const modalSearchRef = useRef<SearchHandler>(null);
  const modalRef = useRef<ModalHandler>(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [modalRows, setModalRows] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));

  const selectRow = (data: void) => {
    onModalClose();
    setModalVisible(false);
    selectDataValue(data);
  };

  const onCleanup = () => {
    modalSearchRef.current.cleanup();
    modalRef.current.cleanup();
  };

  const onRetriveData = () => {
    modalSearchRef.current.submit();
  };

  /**
   *
   */
  type FormProps = {
    search_text: string;
  };

  const onSubmit = (data: FormProps) => {
    /**
     * search_text: 그룹 명
     */
    const searchvalue = {
      search_text: data.search_text,
    };
    api.retriveModal(searchvalue).then((res) => {
      setModalRows(res);
    });
  };

  const onConfirm = () => {
    const tempData = modalRef.current.confirm();
    selectRow(tempData);
    onModalClose();
    setModalVisible(false);
  };

  const onClose = () => {
    onModalClose();
    setModalVisible(false);
  };

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={modalVisible ? 'openModal programSearchModal' : 'programSearchModal'}>
      {modalVisible && (
        <section>
          <ModalTitle
            title="사용자 조회"
            onCleanup={onCleanup}
            useCleanup={true}
            onRetrive={onRetriveData}
            useRetrive={true}
            onConfirm={onConfirm}
            useConfirm={true}
            onClose={onClose}
          ></ModalTitle>
          <main>
            <ModalSearch onSubmit={onSubmit} ref={modalSearchRef}></ModalSearch>
            <ModalGrid originRows={modalRows} onSelectRow={selectRow} ref={modalRef}></ModalGrid>
          </main>
        </section>
      )}
    </div>
  );
};
export default PopModal;
