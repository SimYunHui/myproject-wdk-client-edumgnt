import React from "react";
// import BZCM010E10 from './BZCM010E10';
// import BZCM010E30 from './BZCM010E30';
// import BZCM010Q40 from './BZCM010Q40';
// import BZCM010Q50 from './BZCM010Q50';
// import BZCM030E20 from './BZCM030E20';
// import BZCM030Q30 from './BZCM030Q30';
// import HLTH010E10 from "./HLTH010E10";
import {
  COMM010E01,
  COMM010E02,
  COMM010E03,
  COMM020E01,
  COMM030E01,
  COMM030E02,
  COMM030E03,
  COMM030E04,
  COMM030E05,
  COMM030E06,
  COMM030E07,
  COMM030Q01,
  COMM040E01,
  COMM040E02,
  Notice,
} from "./COMM/index";

type Props = {
  path?: string;
};

function PageRouter({ path }: Props) {
  const programPath = location.href.split("/")[4];
  console.log("programPath" + programPath);

  switch (programPath) {
    case "COMM010E01": {
      return <COMM010E01 />;
    }
    case "COMM010E02": {
      return <COMM010E02 />;
    }
    case "COMM010E03": {
      return <COMM010E03 />;
    }
    case "COMM020E01": {
      return <COMM020E01 />;
    }
    case "COMM030E01": {
      return <COMM030E01 />;
    }
    case "COMM030E02": {
      return <COMM030E02 />;
    }
    case "COMM030E03": {
      return <COMM030E03 />;
    }
    case "COMM030E04": {
      return <COMM030E04 />;
    }
    case "COMM030E05": {
      return <COMM030E05 />;
    }
    case "COMM030E06": {
      return <COMM030E06 />;
    }
    case "COMM030E07": {
      return <COMM030E07 />;
    }
    case "COMM030Q01": {
      return <COMM030Q01 />;
    }
    case "COMM040E01": {
      return <COMM040E01 />;
    }
    case "COMM040E02": {
      return <COMM040E02 />;
    }
    case "Notice": {
      return <Notice />;
    }
    case "BZCM010E20": {
      return <Notice />;
    }
    // case "BZCM010E10": {
    //   return <BZCM010E10 />;
    // }
    // case "BZCM010E30": {
    //   return <BZCM010E30 />;
    // }
    // case "BZCM010Q40": {
    //   return <BZCM010Q40 />;
    // }
    // case "BZCM010Q50": {
    //   return <BZCM010Q50 />;
    // }
    // case "BZCM030E20": {
    //   return <BZCM030E20 />;
    // }
    // case "BZCM030Q30": {
    //   return <BZCM030Q30 />;
    // }
    // case "HLTH010E10": {
    //   return <HLTH010E10 />;
    // }

    default: {
      return <div>표시할 페이지가 없습니다.</div>;
    }
  }
}

export default React.memo(PageRouter);
