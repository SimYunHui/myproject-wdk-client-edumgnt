import {
    ESGrid,
    getDate,
    GridHdBtnType,
    GridHeader,
    userInfoGlobalState,
  } from "@vntgcorp/vntg-wdk-client";
  import React, { useEffect, useState } from "react";
import { RightContentGrid_Config } from "./RightContentGrid_Config";
import { v4 as uuid } from 'uuid';
  
  type MasterGridProps = {
    originRows: Array<any>;
    onSelectData: (value)=>void;
    /**  */
  };
  
  const dumyData = [
    {
      emp_name: "Tester",
      exec_ctnt: "테스트 등록 관련 입력을 했습니다.",
     },
  ];
  
  type GridForwardFunc={
    cleanup:()=>void;
    save:()=>any;
    changeData :(name: string, value: string) => void;
  }
  
  const RightContentGrid = React.forwardRef<GridForwardFunc, MasterGridProps>(
    ({originRows, onSelectData}, ref) => {
    /**
    * Ref. 를 통한 이벤트 전달함수
    */
      React.useImperativeHandle(ref, () => ({
        cleanup() { 
            masterGrid.current.clearnRow();
        },
        save() {
            return masterGrid.current.getCudRows();
        },
        changeData(name, value){
            if(selectedRowIndex !=null){
                masterGrid.current.setValue(selectedRowIndex, name, value);
            }
            
        }
      }));
      const masterGrid = React.useRef<ESGrid>(null);
      const [selectedRowIndex, setSelectedRowIndex] = useState<number>(null);
  
      React.useEffect(() => {
        masterGrid.current = new ESGrid("BZCM020E10GRID");
        masterGrid.current.initializeGrid(RightContentGrid_Config, originRows);
        masterGrid.current.setRows(originRows);

        masterGrid.current.onCurrentRowChanged((row)=>{
            setSelectedRowIndex(row._row.index);
            onSelectData(row.value);
        });

        return () => {
          masterGrid.current.destroy();
        };
      }, []);

      useEffect(()=> {
        masterGrid.current.setRows(originRows);
      }, [originRows]);

  
      const gridBtnEvent = (type: any) => {
        switch (type) {
          case GridHdBtnType.plus: {
            const todayString = getDate(new Date().toString());
            masterGrid.current.insertRow({
            report_no: uuid(),
            report_write_date: todayString,
            emp_name: '',
            exec_ctnt: null,
            plan_ctnt: null,
            remark: null,
            });
            break;
          }
          case GridHdBtnType.minus: {
            masterGrid.current.getGridView().cancel();
            masterGrid.current.deleteRow();
            break;
          }
          case GridHdBtnType.reflash: {
            masterGrid.current.getGridView().cancel();
            masterGrid.current.setRows(originRows);
            break;
          }
          default:
            break;
        }
      };
      return (
        <div className="grid">
          <GridHeader
            title={"업무일지 목록"}
            type="default"
            gridBtnEvent={gridBtnEvent}
          />
          <div className="realGrid" id="BZCM020E10GRID"></div>
        </div>
      );
    }
  );
  
  export default RightContentGrid;