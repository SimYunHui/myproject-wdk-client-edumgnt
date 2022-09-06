import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { GridBase, RowState, ValidationError, ValidationLevel } from "realgrid";
import useConfirm from "@vntgcorp/vntg-wdk-client";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { info, warning } from "@vntgcorp/vntg-wdk-client";
import { GridHdBtnType, GridHeader } from "@vntgcorp/vntg-wdk-client";

import { Config } from "./200_MasterGridConfig";
import { FIELD } from "./constants";
import { MasterGridProps, RowDataType } from "./Types";
import { emailRegEzp } from "./validations";

let masterGrid: ESGrid;

export const getGridValues = (originRows = []) => {
  const gridView = masterGrid.getGridView();
  let saveData: RowDataType[] = [];
  masterGrid.setIsNotEmptyColumn([FIELD.PLANT_CODE, FIELD.EMP_NAME]);
  gridView.onValidateColumn = function (
    grid,
    column,
    inserting,
    value,
    itemIndex,
    dataRow
  ) {
    const error: ValidationError = {
      message: "",
      level: ValidationLevel.IGNORE,
    };
    if (column.name === FIELD.EMAIL) {
      if (value && !emailRegEzp.test(value)) {
        error.level = ValidationLevel.WARNING;
        error.message = "e-mail 형식으로 입력해주세요";
      }
    }
    if (column.name === FIELD.EMP_NO) {
      if (!value) {
        error.level = ValidationLevel.ERROR;
        error.message = "필수 입력 사항입니다";
      } else {
        const data = grid.getDataSource().getJsonRow(dataRow, true);
        //새로 추가된 데이터 중 기존 리스트에 있는 사번 중복 체크
        if (data.row_stat === "added") {
          const findEmpNo = originRows.find((item) => item.emp_no === value);
          if (findEmpNo) {
            error.level = ValidationLevel.WARNING;
            error.message = "중복된 사번입니다";
          }
        }
      }
    }
    return error;
  };

  const create = masterGrid.getDataProvier().getStateRows(RowState.CREATED);
  const update = masterGrid.getDataProvier().getStateRows(RowState.UPDATED);
  // 유효성 검사 설정
  const getInvalidCells = masterGrid.validateCells(
    masterGrid.getGridView().getItemsOfRows([...create, ...update])
  );
  if (getInvalidCells) {
    warning("저장할 데이터를 확인해주세요");
    return null;
  } else {
    saveData = masterGrid.getCudRows();
  }

  // 유효성 검사 초기화
  gridView.onValidateColumn = null;

  return saveData;
};

export const addRow = (data) => masterGrid.insertRow(data);
export const setRowValue = (index, fieldName, value) => {
  masterGrid.setValue(index, fieldName, value);
};

export const setRowState = (index, state) => {
  const provider = masterGrid.getDataProvier();
  provider.setRowState(index, state);
};

const MasterGrid: React.FC<MasterGridProps> = forwardRef(
  (
    {
      busiCode,
      title,
      originRows,
      styles,
      onAddRow,
      onSelectRow,
      onSetUnitWorkNumber,
    },
    ref
  ) => {
    // const { isConfirmed } = useConfirm();
    const [rowCnt, setRowCnt] = useState<number>(null);
    useImperativeHandle(ref, () => ({
      cleanup() {
        masterGrid.clearnRow();
        setRowCnt(null);
      },
      changeData(rowIndex: number, fieldName: string, value: string) {
        masterGrid.setValue(rowIndex, fieldName, value);
      },
      currentFocusedRowIndex() {
        return masterGrid.getFocusedRowHandle();
      },
    }));

    useEffect(() => {
      masterGrid = new ESGrid("bzcm010e10grid");
      masterGrid.initializeGrid(Config, originRows);
      masterGrid.setDateColumn(FIELD.ENT_DATE);
      masterGrid.setDateColumn(FIELD.BIRTHDAY);
      masterGrid.setLookup(FIELD.UNIT_WORK_CODE, "CM12");
      masterGrid.setLookup(FIELD.RESPONSI, "CM27");
      masterGrid.setLookup(FIELD.GENDER, "CM29");
      masterGrid.setNumberEditor([FIELD.EMP_NO]);
      masterGrid.setPhoneNumber(FIELD.MOBILE_NO);
      masterGrid.setBoolColumn(FIELD.ON_WORK_YN);

      masterGrid.setEditOnlyCreate(FIELD.EMP_NO);
      masterGrid.setEditOnlyCreate(FIELD.EMP_NAME);
      const gridView = masterGrid.getGridView();
      gridView.setPasteOptions({ enabled: true });
      gridView.setCopyOptions({
        copyDisplayText: false,
        lookupDisplay: false,
        singleMode: true,
      });
      masterGrid.onCellButtonClicked((grid: GridBase, index) => {
        const { plant_code } = grid
          .getDataSource()
          .getJsonRow(index.dataRow, true);
        onSelectRow(plant_code);
      });
      masterGrid.onCellEdited(function (gb: GridBase, itemIndex, row, field) {
        if (field === 7) {
          const { plant_code, equip_code, unit_work_code } = gb.getValues(
            itemIndex
          ) as RowDataType;
          masterGrid.commit();
          onSetUnitWorkNumber(plant_code, equip_code, unit_work_code);
        }
      });

      return () => masterGrid.destroy();
    }, []);

    useEffect(() => {
      masterGrid.setLookupTreePlant(FIELD.PLANT_CODE, busiCode);
      masterGrid.setLookupTreeEquip(FIELD.EQUIP_CODE, FIELD.PLANT_CODE);
      masterGrid.setLookupTreeUnitWork(
        "unit_work_code",
        busiCode,
        "equip_code"
      );
    }, [busiCode]);

    useEffect(() => {
      masterGrid.setRows(originRows);
      setRowCnt(originRows.length);
    }, [originRows]);

    const addRow = () => {
      masterGrid.commit();
      onAddRow();
    };

    const minusRow = async () => {
      const curr = masterGrid.getGridView().getCurrent();
      // if (curr.dataRow !== -1) {
      //   const { result } = await isConfirmed(
      //     "행 삭제 확인",
      //     "해당 행을 삭제 하시겠습니까?",
      //     false
      //   );
      //   if (result) {
      //     masterGrid.deleteRow();
      //   }
      // } else {
      //   info("삭제할 행을 선택해주세요");
      // }
    };

    const refresh = () => {
      masterGrid.reflashRow(originRows);
    };

    const gridBtnEvent = (type) => {
      switch (type) {
        case GridHdBtnType.plus:
          addRow();
          break;
        case GridHdBtnType.minus:
          minusRow();
          break;
        case GridHdBtnType.reflash:
          refresh();
          break;
        default:
          break;
      }
    };

    return (
      <div className="grid" style={styles}>
        <GridHeader
          title={title}
          type="default"
          gridBtnEvent={gridBtnEvent}
          rowCnt={rowCnt}
        />
        <div className="realGrid" id="bzcm010e10grid" />
      </div>
    );
  }
);

export default React.memo(MasterGrid);
