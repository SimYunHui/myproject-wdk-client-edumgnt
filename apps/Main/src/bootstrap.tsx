import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { initLibraries } from "@vntgcorp/vntg-wdk-client/dist/app/src/layout/initLib";

import AppRouter from "./AppRouter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "realgrid/dist/realgrid-style.css";

import App, {
  Loading,
  RouteContainer,
  LeftSideMenu,
  Topmenu,
  PrivateRoute,
  AppModal,
  ConfirmContextProvider,
} from "@vntgcorp/vntg-wdk-client";
import { RecoilRoot } from "recoil";
import ConfirmModal from "@vntgcorp/vntg-wdk-client/dist/app/src/components/ConfirmModal/ConfirmModal";
const initUI = () => {
  ReactDOM.render(
    // <React.StrictMode>
    <RecoilRoot>
      <ConfirmContextProvider>
        <ConfirmModal />
        <React.Suspense fallback={<Loading />}>
          <BrowserRouter>
            <Routes>
              <Route
                path="*"
                element={
                  <PrivateRoute>
                    <Topmenu />
                    <LeftSideMenu />
                    <AppRouter />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </React.Suspense>
      </ConfirmContextProvider>
      <AppModal />
    </RecoilRoot>,
    // </React.StrictMode>,
    document.getElementById("root")
  );
};

//라이브러리 스토리지 셋팅
initLibraries().then(() => {
  initUI();
});
