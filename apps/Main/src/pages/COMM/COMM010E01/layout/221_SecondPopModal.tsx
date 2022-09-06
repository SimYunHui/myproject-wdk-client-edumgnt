import React, { useRef, useState } from 'react';
import { ModalTitle } from '@vntgcorp/vntg-wdk-client';
import ModalSearch from './221_SecondPopModalSearchForm';
import ModalGrid from './221_SecondPopModalGrid';
import { ModalHandler, SearchHandler } from './Types';
import '../../../../css/programSearchModal.css';
import ApiCall from '../action/API';
import { IResData as IHttpResData, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';

type SecondPopModalProps = {
  onModalClose?: () => void;
  selectDataValue?: (data: any) => void;
  ref?: React.ReactNode;
};

const SecondPopModal: React.FC<SecondPopModalProps> = ({ onModalClose, selectDataValue }) => {
  const modalSearchRef = useRef<SearchHandler>();
  const modalRef = useRef<ModalHandler>();
  const [modalVisible, setModalVisible] = useState(true);
  const [modalRows, setModalRows] = useState([]);
  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));

  const selectRow = (data: any) => {
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
    console.log('second modal index page onSubmit 🎃>> ', data);
    /**
     * search_text: Role 명
     */
    const searchvalue = {
      search_text: data.search_text === '' ? '%' : data.search_text,
    };
    api.retriveSecondModal(searchvalue).then((res) => {
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
            title="Role 조회"
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
export default SecondPopModal;
