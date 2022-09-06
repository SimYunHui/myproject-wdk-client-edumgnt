import React, { useRef, useState } from 'react';
import { ModalTitle } from '@vntgcorp/vntg-wdk-client';
import ModalSearch from './211_PopModalSearchForm';
import ModalGrid from './211_PopModalGrid';
import { SearchHandler, ModalHandler, DetailGridRowDataType } from './Types';
import '../../../../css/programSearchModal.css';
import { IResData as IHttpResData, useSyncHttpCient } from '@vntgcorp/vntg-wdk-client';
import ApiCall from '../action/API';
import { warning } from '@vntgcorp/vntg-wdk-client';
import _ from 'lodash';

type PopModalProps = {
  onModalClose?: () => void;
  selectDataValue?: (data: any) => void;
  ref?: React.ReactNode;
  detailRows?: DetailGridRowDataType[] | null;
};
let currDetailRows: DetailGridRowDataType[];
let addDetailRows: DetailGridRowDataType | DetailGridRowDataType[];
let tempDetailRows: DetailGridRowDataType[] = [];
const PopModal: React.FC<PopModalProps> = ({ onModalClose, selectDataValue, detailRows }) => {
  const modalSearchRef = useRef<SearchHandler>(null);
  const modalRef = useRef<ModalHandler>(null);
  const [modalVisible, setModalVisible] = useState(true);
  const [modalRows, setModalRows] = useState([]);

  // eslint-disable-next-line no-empty-pattern
  const [{}, fetchRequest] = useSyncHttpCient<IHttpResData>();
  const [api] = useState(new ApiCall(fetchRequest));

  const selectRow = (data: DetailGridRowDataType[]) => {
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
    console.log('first modal index page onSubmit 🎃>> ', data);
    /**
     * search_text: 그룹 명
     */
    const searchvalue = {
      search_text: data.search_text === '' ? '%' : data.search_text,
    };
    api.retriveModal(searchvalue).then((res) => {
      setModalRows(res);
    });
  };

  const onConfirm = () => {
    const tempData = modalRef.current.confirm();
    addDetailRows = [];

    currDetailRows = detailRows;

    //기존 그룹에 사용자가 있을경우('+'신규행 추가상태 제외 original data 존재할 때).
    if (!_.isEmpty(currDetailRows)) {
      for (let i = 0; i < tempData['length']; i++) {
        let existYn = false;
        for (let j = 0; j < currDetailRows['length']; j++) {
          if (currDetailRows[j].user_id === tempData[i]['user_id']) {
            warning('ID: "' + tempData[i]['user_id'] + '" 는(은) 이미 존재하는 ID입니다. ');
            existYn = true;
          }
        }
        if (existYn == false) {
          addDetailRows.push(tempData[i]);
          currDetailRows.push(tempData[i]);
        }
      }
    }
    //기존 그룹에 사용자가 없을경우('+' 신규행 추가상태로 저장 안한경우 포함).
    else {
      if (!_.isEmpty(tempDetailRows)) {
        for (let i = 0; i < tempData['length']; i++) {
          let existYn = false;
          for (let j = 0; j < tempDetailRows['length']; j++) {
            if (tempDetailRows[j].user_id === tempData[i]['user_id']) {
              warning('ID: "' + tempData[i]['user_id'] + '" 는(은) 이미 존재하는 ID입니다. ');
              existYn = true;
            }
          }
          if (existYn == false) {
            addDetailRows.push(tempData[i]);
            tempDetailRows.push(tempData[i]);
          }
        }
      } else {
        for (let i = 0; i < tempData['length']; i++) {
          addDetailRows.push(tempData[i]);
          tempDetailRows.push(tempData[i]);
        }
      }
    }

    console.log(currDetailRows);
    console.log(addDetailRows);
    selectRow(addDetailRows);
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
