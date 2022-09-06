/**
 *  메뉴 권한 등록 개인 메뉴 리스트 등록
 * By Pang
 */
import _ from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import {useConfirm} from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";
import { Config } from './210_DetailGroupGridConfig';

/**
 *
 * @param {*} title
 * @param {*} originRows
 * @function saveData

 * @param ref
 */
type DetailGridProps = {
  title: string;
  originRows: any;
  onSelectRow?: any;
  addGroupData?: any;
  onAddGroupData?: any;
  ref?: any;
};
let groupDetailGrid: ESGrid;
const DetailGroupGrid: React.FC<DetailGridProps> = forwardRef(
  ({ title, originRows, addGroupData, onAddGroupData }, ref) => {
    const { isConfirmed } = useConfirm();
    const [menuData, setGetMenuData] = useState<any>();
    /**
     * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
     * @param str       : 체크할 문자열
     */
    // function isEmpty(data: any) {
    //   if (typeof data == 'undefined' || data == null || data == '') return true;
    //   else return false;
    // }
    useImperativeHandle(ref, () => ({
      toSave() {
        const updatedRows = groupDetailGrid.checkGridData();
        console.log(updatedRows);
        if (updatedRows) {
          return updatedRows;
        }
      },
      getMenuData(data: any) {
        setGetMenuData(data);
      },

      cleanup() {
        groupDetailGrid.clearnRow();
      },

      //디테일 변경내용 확인
      changeData() {
        const rowCnt = groupDetailGrid.getRowStateCount('*');
        return rowCnt;
      },
    }));

    useEffect(() => {
      groupDetailGrid = new ESGrid('groupDetailGrid');
      return () => {
        groupDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      if (groupDetailGrid) {
        console.log('groupDetailGridinit');
        groupDetailGrid.initializeGrid(Config, originRows);
        groupDetailGrid.setBoolColumn('use_yn');
        groupDetailGrid.setBoolColumn('select_yn');
        groupDetailGrid.setBoolColumn('save_yn');
        groupDetailGrid.setBoolColumn('print_yn');
        groupDetailGrid.setBoolColumn('custom_yn');
        groupDetailGrid.setEvenFillStyle();
        /**
         * 선택시
         */
        groupDetailGrid.getGridView().onCellClicked = function (_grid: any, clickData: any) {
          const row = clickData.dataRow;
          if (typeof row != 'number') return;
          if (row > -1) {
            //empty-error : fix
          }
        };
      }
    }, [groupDetailGrid]);

    useEffect(() => {
      groupDetailGrid.setRows(originRows);
    }, [originRows]);

    useEffect(() => {
      console.log(addGroupData.keys);
      if (addGroupData.keys !== undefined) {
        addGroupData.map((index: { group_sno: any; group_name: any }) => {
          if (index.group_sno) {
            console.log(index);
            const cmGroupAuth = {
              group_name: index.group_name,
              group_sno: index.group_sno,
              run_sno: menuData.run_sno,
              use_yn: 'N',
              select_yn: 'N',
              save_yn: 'N',
              print_yn: 'N',
              custom_yn: 'N',
              row_stat: 'added',
              __rowState: 'created',
            };
            groupDetailGrid.appendRow(cmGroupAuth);
          }
        });
      }
    }, [addGroupData]);
    ///////////////////////////////////////////////////////////////////////////////////
    // 공통버튼 이벤트
    ///////////////////////////////////////////////////////////////////////////////////

    const addRow = () => {
      console.log('>>> Group_Detail_Grid add start');
      // const isNullProgramList = isEmpty(programList);
      console.log(menuData);
      if (!(menuData !== undefined && menuData.length !== 0)) {
        warning('프로그램을 설정해주세요!');
      } else {
        if (menuData.run_sno == -1) {
          warning('폴더메뉴가 아닌 실행메뉴를 선택해주세요.');
          return;
        }
        onAddGroupData();
      }

      //팝업을 이용한 행추가 필요.
    };

    const minusRow = async () => {
      const curr = groupDetailGrid.getFocusedRowHandle();
      if (curr.dataRow !== -1) {
        const { result } = await isConfirmed('행 삭제 확인', '해당 행을 삭제 하시겠습니까?', false);
        if (result) {
          groupDetailGrid.deleteRow();
        }
      } else {
        info('삭제할 행을 선택해주세요');
      }
    };

    // const dataDownload = () => {
    //   //https://docs.realgrid.com/guides/tip/excel-import
    //   console.log('dataDownload');
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
          groupDetailGrid.reflashRow(originRows);
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
        <div className="realGrid" id="groupDetailGrid"></div>
      </div>
    );
  },
);
export default DetailGroupGrid;
