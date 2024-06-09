// generated using `generate_index.py`

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import "./index.css";

const SliderApp = React.lazy(() => import("./SliderApp"));
const RecursiveDropletsWatercolorApp = React.lazy(() =>
  import("./RecursiveDropletsWatercolorApp")
);
const RecursiveDropletsBasicApp = React.lazy(() =>
  import("./RecursiveDropletsBasicApp")
);
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
            <Link to="SliderApp">SliderApp</Link>
            <Link to="RecursiveDropletsWatercolorApp">
              RecursiveDropletsWatercolorApp
            </Link>
            <Link to="RecursiveDropletsBasicApp">
              RecursiveDropletsBasicApp
            </Link>
            <Link to="MainApp">MainApp</Link>
            <Link to="BigBucketApp">BigBucketApp</Link>
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
