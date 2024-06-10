// generated using `generate_index.py`

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import "./index.css";

const SliderApp = React.lazy(() => import("./SliderApp"));
const RecursiveDropletsWatercolorApp = React.lazy(() => import("./RecursiveDropletsWatercolorApp"));
const RecursiveDropletsBasicApp = React.lazy(() => import("./RecursiveDropletsBasicApp"));
const MainApp = React.lazy(() => import("./MainApp"));
const BigBucketApp = React.lazy(() => import("./BigBucketApp"));


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Routes>
      <Route
        index
        element={
          <main>
            <div className="main-container">
              <Link to="SliderApp" title="SliderApp" ><img src="SliderApp.png" className="linkPics" /></Link>
              <Link to="RecursiveDropletsWatercolorApp" title="RecursiveDropletsWatercolorApp" ><img src="RecursiveDropletsWatercolorApp.png" className="linkPics" /></Link>
              <Link to="RecursiveDropletsBasicApp" title="RecursiveDropletsBasicApp" ><img src="RecursiveDropletsBasicApp.png" className="linkPics" /></Link>
              <Link to="MainApp" title="MainApp" ><img src="MainApp.png" className="linkPics" /></Link>
              <Link to="BigBucketApp" title="BigBucketApp" ><img src="BigBucketApp.png" className="linkPics" /></Link>
            </div>
          </main>
        }
      />
      <Route
        path="SliderApp"
        element={
          <React.Suspense fallback={<>...</>}>
            <SliderApp />
          </React.Suspense>
        }
      />
      <Route
        path="RecursiveDropletsWatercolorApp"
        element={
          <React.Suspense fallback={<>...</>}>
            <RecursiveDropletsWatercolorApp />
          </React.Suspense>
        }
      />
      <Route
        path="RecursiveDropletsBasicApp"
        element={
          <React.Suspense fallback={<>...</>}>
            <RecursiveDropletsBasicApp />
          </React.Suspense>
        }
      />
      <Route
        path="MainApp"
        element={
          <React.Suspense fallback={<>...</>}>
            <MainApp />
          </React.Suspense>
        }
      />
      <Route
        path="BigBucketApp"
        element={
          <React.Suspense fallback={<>...</>}>
            <BigBucketApp />
          </React.Suspense>
        }
      />
    </Routes>
  </HashRouter>
);

    