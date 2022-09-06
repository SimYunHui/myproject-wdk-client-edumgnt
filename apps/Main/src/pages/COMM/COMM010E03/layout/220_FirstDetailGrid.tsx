import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { ESGrid } from "@vntgcorp/vntg-wdk-client";
import { FIRSTDETAILFIELD, FirstDetailGridRowDataType } from "./constants";
import { Config } from "./220_FirstDetailGridConfig";
import { GridHeader } from "@vntgcorp/vntg-wdk-client";

type FirstDetailGridProps = {
  title: string;
  originRows: FirstDetailGridRowDataType[];
  ref?: React.ReactNode;
};

let firstDetailGrid: ESGrid;

const FirstDetailGrid: React.FC<FirstDetailGridProps> = forwardRef(
  ({ title, originRows }, ref) => {
    const gridRef = useRef(null);

    useImperativeHandle(ref, () => ({
      cleanup() {
        firstDetailGrid.clearnRow();
      },
    }));

    useEffect(() => {
      firstDetailGrid = new ESGrid("firstdetailgrid");
      const gridView = firstDetailGrid.getGridView();
      firstDetailGrid.initializeGrid(Config, originRows);
      const gridControlOptions = {
        editable: false,
        updatable: false,
        insertable: false,
        appendable: false,
        deletable: false,
        softDeleting: false,
      };
      firstDetailGrid.setGridOptions(gridControlOptions);
      firstDetailGrid.setEvenFillStyle();
      gridView.setColumns(Config);
      firstDetailGrid.setLookup(FIRSTDETAILFIELD.SYSTEM_TYPE, "AA02");
      firstDetailGrid.setBoolColumn("use_yn");
      return () => {
        firstDetailGrid.destroy();
      };
    }, []);

    useEffect(() => {
      firstDetailGrid.setRows(originRows);
    }, [originRows]);

    return (
      <div className="grid">
        <GridHeader title={title} type="arrow" />
        <div className="realGrid" id="firstdetailgrid" ref={gridRef}></div>
      </div>
    );
  }
);

export default FirstDetailGrid;
