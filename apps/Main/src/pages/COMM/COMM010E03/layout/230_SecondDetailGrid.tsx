import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { SECONDDETAILFIELD, SecondDetailGridRowDataType } from "./constants";
import { Config } from "./230_SecondDetailGridConfig";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";

type SecondDetailGridProps = {
  title: string;
  originRows: SecondDetailGridRowDataType[];
  ref?: React.ReactNode;
};

let secondDetailGrid: ESGrid;

const SecondDetailGrid: React.FC<SecondDetailGridProps> = forwardRef(
  ({ title, originRows }, ref) => {
    const gridRef = useRef(null);

    useImperativeHandle(ref, () => ({
      cleanup() {
        secondDetailGrid.clearnRow();
      },
    }));

    useEffect(() => {
      secondDetailGrid = new ESGrid("seconddetailgrid");
      const gridView = secondDetailGrid.getGridView();
      secondDetailGrid.initializeGrid(Config, originRows);
      const gridControlOptions = {
        editable: false,
        updatable: false,
        insertable: false,
        appendable: false,
        deletable: false,
        softDeleting: false,
      };
      secondDetailGrid.setGridOptions(gridControlOptions);
      secondDetailGrid.setEvenFillStyle();
      gridView.setColumns(Config);
      secondDetailGrid.setBoolColumn(SECONDDETAILFIELD.SYSTEM_YN);
      secondDetailGrid.setBoolColumn(SECONDDETAILFIELD.USE_YN);
      secondDetailGrid.setLookup(SECONDDETAILFIELD.ROLE_TYPE, "AA14");
      return () => {
        secondDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      secondDetailGrid.setRows(originRows);
    }, [originRows]);

    return (
      <div className="grid">
        <GridHeader title={title} type="arrow" />
        <div className="realGrid" id="seconddetailgrid" ref={gridRef}></div>
      </div>
    );
  }
);
export default SecondDetailGrid;
