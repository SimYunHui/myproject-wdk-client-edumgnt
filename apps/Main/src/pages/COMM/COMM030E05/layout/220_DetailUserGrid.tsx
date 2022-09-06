/**
 *  관리감독자 업무일지 목록
 */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {useConfirm} from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from './220_DetailUserGridConfig';

type DetailUserGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  addUserData?: any;
  onAddUserData?: any;
  ref?: any;
};
let userDetailGrid: ESGrid;
const DetailUserGrid: React.FC<DetailUserGridProps> = forwardRef(
  ({ title, originRows, addUserData, onAddUserData }, ref) => {
    const { isConfirmed } = useConfirm();
    const [programList, setProgramList] = useState<string>();

    /**
     * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
     * @param str       : 체크할 문자열
     */
    function isEmpty(data: any) {
      if (typeof data == 'undefined' || data == null || data == '') return true;
      else return false;
    }
    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = userDetailGrid.checkGridData();
        console.log(updatedRows);
        if (updatedRows) {
          return updatedRows;
        }
      },
      getProgramList(data: string) {
        setProgramList(data);
      },

      cleanup() {
        userDetailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = userDetailGrid.getRowStateCount('*');
        return rowCnt;
      },
    }));

    useEffect(() => {
      userDetailGrid = new ESGrid('userDetailGrid');
      return () => {
        userDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      console.log('detail Sub Grid Call');
      if (userDetailGrid) {
        userDetailGrid.initializeGrid(Config, originRows);
        userDetailGrid.setBoolColumn('use_yn');
        userDetailGrid.setBoolColumn('select_yn');
        userDetailGrid.setBoolColumn('save_yn');
        userDetailGrid.setBoolColumn('print_yn');
        userDetailGrid.setBoolColumn('custom_yn');
        userDetailGrid.setEvenFillStyle();
        /**
         * 선택시
         */
        userDetailGrid.getGridView().onCellClicked = function (_grid: any, clickData: any) {
          const row = clickData.dataRow;
          if (typeof row != 'number') return;
          if (row > -1) {
            console.log('Selected Row Data is  : ');
          }
        };
      }
    }, [userDetailGrid]);

    useEffect(() => {
      userDetailGrid.setRows(originRows);
    }, [originRows]);

    useEffect(() => {
      console.log(addUserData.keys);
      if (addUserData.keys !== undefined) {
        addUserData.map((index: { user_id: any; user_name: any }) => {
          if (index.user_id) {
            const cmUserAuth = {
              user_id: index.user_id,
              user_name: index.user_name,
              run_sno: programList,
              use_yn: 'N',
              select_yn: 'N',
              save_yn: 'N',
              print_yn: 'N',
              custom_yn: 'N',
              row_stat: 'added',
              __rowState: 'created',
            };
            userDetailGrid.appendRow(cmUserAuth);
          }
        });
      }
    }, [addUserData]);
    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    const addRow = () => {
      console.log('>>> Menu_Program_Grid add start');

      const isNullProgramList = isEmpty(programList);
      console.log(isNullProgramList);
      if (!(programList !== undefined && programList.length !== 0)) {
        warning('프로그램을 설정해주세요!');
      } else {
        onAddUserData();
      }
    };

    const minusRow = async () => {
      const curr = userDetailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed('행 삭제 확인', '해당 행을 삭제 하시겠습니까?', false);
        if (result) {
          userDetailGrid.deleteRow();
        }
      } else {
        info('삭제할 행을 선택해주세요');
      }
    };

    // const dataDownload = () => {
    //   //https://docs.realgrid.com/guides/tip/excel-import
    //   console.log(userDetailGrid);
    // };

    const gridBtnEvent = (type: any) => {
      switch (type) {
        case GridHdBtnType.plus:
          addRow();
          break;
        case GridHdBtnType.minus:
          minusRow();
          break;
        case GridHdBtnType.reflash:
          userDetailGrid.reflashRow(originRows);
          break;

        case GridHdBtnType.leftshift:
          break;
        default:
          break;
      }
    };
    return (
      <div className="grid">
        <GridHeader title={title} type="default" gridBtnEvent={gridBtnEvent} />
        <div className="realGrid" id="userDetailGrid"></div>
      </div>
    );
  },
);
export default DetailUserGrid;
