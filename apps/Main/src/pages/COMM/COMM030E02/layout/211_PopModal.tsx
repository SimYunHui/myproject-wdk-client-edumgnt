import React, { useRef, useState } from 'react';
import ApiCall from './../action/API';
import { ModalTitle } from '@vntgcorp/vntg-wdk-client';
import PopGrid, { PopGridHandler } from './211_PopModalGrid';
import '../../../../css/programSearchModal.css';
import { ModalSearch, ModalSearchHandler } from './211_PopModalSearchForm';
import { IResData as IHttpResData, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import { warning } from '@vntgcorp/vntg-wdk-client';
import _ from 'lodash';

type Handler = {
  cleanup: () => void;
};

type PopModalProps = {
  onModalClose?: any;
  onRetrive?: any;
  dataList?: any;
  selectDataValue?: any;
};

const PopModal: React.FC<PopModalProps> = ({ onModalClose, selectDataValue }) => {
  const gridRef = useRef<Handler & PopGridHandler>(null);
  const modalSearchRef = useRef<Handler & ModalSearchHandler>(null);
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

  const onClose = () => {
    onModalClose();
    setModalVisible(false);
  };

  /**
   * 조회
   */
  type FormProps = {
    searchText: string;
    selectBox: string;
  };

  const onSubmit = (data: FormProps) => {
    console.log('first modal index page onSubmit 🎃>> ', data);

    const searchvalue = {
      search_text: data.searchText,
      system_code: data.selectBox,
    };

    api.retriveProgramModal(searchvalue).then((res) => {
      setModalRows(res);
    });
  };

  const onRetriveData = () => {
    modalSearchRef.current.submit();
  };
  const Cleanup = () => {
    gridRef.current.cleanup();
  };
  const onConfirm = () => {
    const tempData = gridRef.current.confirm();
    if (_.isEmpty(tempData)) {
      warning('선택된 데이터가 없습니다.');
      return;
    }
    selectRow(tempData);
    onModalClose();
    setModalVisible(false);
  };
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={modalVisible ? 'openModal programSearchModal' : 'programSearchModal'}>
      {modalVisible && (
        <section>
          <ModalTitle
            title="프로그램 조회"
            useRetrive={true}
            onConfirm={onConfirm}
            useConfirm={true}
            useCleanup={true}
            useClose={true}
            onCleanup={Cleanup}
            onRetrive={onRetriveData}
            onClose={onClose}
          ></ModalTitle>
          <main>
            <ModalSearch onSubmit={onSubmit} ref={modalSearchRef}></ModalSearch>
            <PopGrid originRows={modalRows} onSelectRow={selectRow} ref={gridRef}></PopGrid>
          </main>
        </section>
      )}
    </div>
  );
};
export default PopModal;
