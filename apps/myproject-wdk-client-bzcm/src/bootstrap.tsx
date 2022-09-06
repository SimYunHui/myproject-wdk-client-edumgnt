import AppRouter from "./AppRouter";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App, {
  Loading,
  RouteContainer,
  LeftSideMenu,
  Topmenu,
  PrivateRoute,
} from "@vntgcorp/vntg-wdk-client";
// ReactDOM.render(
//   <React.Suspense fallback={<Loading />}>
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/*"
//           element={
//             <PrivateRoute>
//               <AppRouter />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   </React.Suspense>,
//   document.getElementById("root")
// );
ReactDOM.render(<AppRouter />, document.getElementById("root"));
