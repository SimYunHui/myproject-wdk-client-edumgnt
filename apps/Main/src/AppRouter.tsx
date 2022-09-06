import React from "react";
import { loadComponent } from "./utils/loadComponent";
import {
  BrowserRouter,
  Routes,
  Route,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import App, {
  Loading,
  RouteContainer,
  LeftSideMenu,
  Topmenu,
  PrivateRoute,
} from "@vntgcorp/vntg-wdk-client";
import PageRouter from "./pages/PageRouter";
// import BZCM010E10 from "./pages/BZCM010E10";
// import "../../../node_modules/realgrid/dist/realgrid-style.css";
type Props = {};

enum routingType {
  DEFAULT,
  COMMON,
  SAFETY,
  HEALTH,
  BIZCOMMON,
}
function AppRouter({}: Props) {
  console.log("app Router");
  const [routeType, setRouteType] = React.useState<routingType>();
  // const [system, setSystem] = React.useState({});
  const urlParam = useLocation();
  const ProgramLayout = styled.section`
    padding-left: 60px;
    padding-top: 38px;
    height: calc(100% - 10px);
  `;
  React.useEffect(() => {
    const locationURL = window.location.href.split(`/`);
    console.log(locationURL);
    if (locationURL.includes("bizcommon")) {
      setRouteType(routingType.BIZCOMMON);
    } else if (locationURL.includes("common")) {
      setRouteType(routingType.COMMON);
    } else {
      setRouteType(routingType.DEFAULT);
      console.log("out of routign rule");
    }
  }, [urlParam.pathname]);

  switch (routeType) {
    case routingType.BIZCOMMON:
      const Component = React.lazy(
        loadComponent(
          "sub1",
          "default",
          "./AppRouter",
          "http://localhost:3002/remoteEntry.tsx"
        )
      );
      return (
        <ProgramLayout>
          <Component />
        </ProgramLayout>
      );
    case routingType.COMMON:
      return (
        <ProgramLayout>
          <PageRouter />
        </ProgramLayout>
      );
    default: {
      return <RouteContainer />;
    }
  }
}

export default AppRouter;
