// generated using `generate_index.py`

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import "./index.css";

const SliderApp = React.lazy(() => import("./SliderApp"));
const OldMainApp = React.lazy(() => import("./OldMainApp"));
const LargeDropletV2App = React.lazy(() => import("./LargeDropletV2App"));
const ScenarioDropletsApp = React.lazy(() => import("./ScenarioDropletsApp"));
const MainApp = React.lazy(() => import("./MainApp"));
const LargeDropletApp = React.lazy(() => import("./LargeDropletApp"));
const BigBucketApp = React.lazy(() => import("./BigBucketApp"));


const Loader = () => {
  return (
    <section className="sec-loading">
      <div className="one"></div>
    </section>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Routes>
      <Route
        index
        element={
          <main>
            <div className="main-container">
              <Link to="SliderApp" title="Slider" ><img src="SliderApp.png" className="linkPics" /></Link>
              <Link to="OldMainApp" title="Old Main" ><img src="OldMainApp.png" className="linkPics" /></Link>
              <Link to="LargeDropletV2App" title="Large Droplet V2" ><img src="LargeDropletV2App.png" className="linkPics" /></Link>
              <Link to="ScenarioDropletsApp" title="Scenario Droplets" ><img src="ScenarioDropletsApp.png" className="linkPics" /></Link>
              <Link to="MainApp" title="Main" ><img src="MainApp.png" className="linkPics" /></Link>
              <Link to="LargeDropletApp" title="Large Droplet" ><img src="LargeDropletApp.png" className="linkPics" /></Link>
              <Link to="BigBucketApp" title="Big Bucket" ><img src="BigBucketApp.png" className="linkPics" /></Link>
            </div>
          </main>
        }
      />
      <Route
        path="SliderApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <SliderApp />
          </React.Suspense>
        }
      />
      <Route
        path="OldMainApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <OldMainApp />
          </React.Suspense>
        }
      />
      <Route
        path="LargeDropletV2App"
        element={
          <React.Suspense fallback={<Loader />}>
            <LargeDropletV2App />
          </React.Suspense>
        }
      />
      <Route
        path="ScenarioDropletsApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <ScenarioDropletsApp />
          </React.Suspense>
        }
      />
      <Route
        path="MainApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <MainApp />
          </React.Suspense>
        }
      />
      <Route
        path="LargeDropletApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <LargeDropletApp />
          </React.Suspense>
        }
      />
      <Route
        path="BigBucketApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <BigBucketApp />
          </React.Suspense>
        }
      />
    </Routes>
  </HashRouter>
);

    