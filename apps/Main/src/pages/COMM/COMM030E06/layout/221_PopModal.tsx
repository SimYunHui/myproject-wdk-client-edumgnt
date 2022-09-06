import { arrayToTree } from "performant-array-to-tree";
import React, { forwardRef, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  IResData as IHttpResData,
  useSyncHttpCient,
} from "@vntgcorp/vntg-wdk-client";
import { ModalTitle } from "@vntgcorp/vntg-wdk-client";
import ApiCall from "../action/API";
import '../../../../css/programSearchModal.css';
import { SearchRefHandle } from "./100_SearchForm";
import PopTreeGrid, { PopupModalRefHandle } from "./221_PopModalGrid";
import { ModalSearch } from "./221_PopModalSearchForm";
import { warning } from "@vntgcorp/vntg-wdk-client";
import { userInfoGlobalState } from "@vntgcorp/vntg-wdk-client";
import _ from "lodash";

type PopModalProps = {
  onModalClose?: any;
  dataList?: any;
  groupSno?: any;
  selectDataValue?: any;
  ref?: any;
};

const PopSubModal: React.FC<PopModalProps> = forwardRef(
  ({ onModalClose, dataList, groupSno, selectDataValue }, _ref) => {
    const gridRef = useRef<PopupModalRefHandle>();
    const userInfo = useRecoilValue(userInfoGlobalState);
    const modalSearchRef = useRef<SearchRefHandle>();
    const [modalVisible, setModalVisible] = useState(true);
    const [userModalRows, setUserModalRows] = useState([]);
    const [originMenuList, setOriginMenuList] = useState([]);
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
      console.log("first modal index page onSubmit 🎃>> ", data);

      const searchvalue = {
        search_text: data.searchText,
        user_id: userInfo.user_id,
        system_type: data.selectBox,
      };
      api.retriveTreeMenuModal(searchvalue).then((res) => {
        const tempMenuTree = arrayToTree(res, {
          id: "menu_tree_sno",
          parentId: "parent_menu_tree_sno",
          childrenField: "rows",
          dataField: null,
          rootParentIds: {
            0: true,
          },
        });
        tempMenuTree.map((menuItem) => {
          menuItem.icon = "0";
        });
        setOriginMenuList(res);
        gridRef.current.setRowData(tempMenuTree);
        setUserModalRows(tempMenuTree);
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
          <section style={{ width: "550px", height: "600px" }}>
            <ModalTitle
              useRetrive={true}
              useConfirm={true}
              useClose={true}
              onConfirm={onConfirm}
              title="프로그램 조회"
              onCleanup={Cleanup}
              onRetrive={onRetriveData}
              onClose={onClose}
            ></ModalTitle>
            <main>
              <ModalSearch
                onSubmit={onSubmit}
                ref={modalSearchRef}
              ></ModalSearch>

              <PopTreeGrid
                originRows={userModalRows}
                onSelectRow={selectRow}
                dataList={dataList}
                groupSno={groupSno}
                originMenuList={originMenuList}
                ref={gridRef}
              ></PopTreeGrid>
            </main>
          </section>
        )}
      </div>
    );
  }
);
export default PopSubModal;
