import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ViewPage from "./ViewPage";
import { RecoilRoot } from "recoil";
import {
  AppModal,
  ConfirmContextProvider,
  ConfirmModal,
} from "@vntgcorp/vntg-wdk-client";
type AppRouteProps = {};

const AppRouter = (props: AppRouteProps) => {
  console.log(`APP_ROUTER`);
  const [path, setPath] = useState<Array<string>>([]);
  React.useEffect(() => {
    console.log("AppRouter useeffect >>"+location.href.split("/"));
    setPath(location.href.split("/"));
  }, []);

  return (
    <RecoilRoot>
      <ConfirmContextProvider>
        <ViewPage path={path[4]} />
        <AppModal />
        <ConfirmModal />
      </ConfirmContextProvider>
    </RecoilRoot>
  );
};

export default AppRouter;
