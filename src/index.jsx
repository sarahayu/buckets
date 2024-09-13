// generated using `generate_index.py`

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import "./index.css";

const BigBucketApp = React.lazy(() => import("./BigBucketApp"));
const ExplanationAnim2App = React.lazy(() => import("./ExplanationAnim2App"));
const ExplanationAnim2VertApp = React.lazy(() => import("./ExplanationAnim2VertApp"));
const ExplanationAnimApp = React.lazy(() => import("./ExplanationAnimApp"));
const ExplanationAnimVertApp = React.lazy(() => import("./ExplanationAnimVertApp"));
const LargeDropletApp = React.lazy(() => import("./LargeDropletApp"));
const LargeDropletV2App = React.lazy(() => import("./LargeDropletV2App"));
const MainApp = React.lazy(() => import("./MainApp"));
const OldMainApp = React.lazy(() => import("./OldMainApp"));
const ScenarioDropletsApp = React.lazy(() => import("./ScenarioDropletsApp"));
const SliderApp = React.lazy(() => import("./SliderApp"));


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
              <Link to="BigBucketApp" title="Big Bucket" ><img src="BigBucketApp.png" className="linkPics" /></Link>
              <Link to="ExplanationAnim2App" title="Explanation Anim 2" ><img src="ExplanationAnim2App.png" className="linkPics" /></Link>
              <Link to="ExplanationAnim2VertApp" title="Explanation Anim 2 Vert" ><img src="ExplanationAnim2VertApp.png" className="linkPics" /></Link>
              <Link to="ExplanationAnimApp" title="Explanation Anim" ><img src="ExplanationAnimApp.png" className="linkPics" /></Link>
              <Link to="ExplanationAnimVertApp" title="Explanation Anim Vert" ><img src="ExplanationAnimVertApp.png" className="linkPics" /></Link>
              <Link to="LargeDropletApp" title="Large Droplet" ><img src="LargeDropletApp.png" className="linkPics" /></Link>
              <Link to="LargeDropletV2App" title="Large Droplet V2" ><img src="LargeDropletV2App.png" className="linkPics" /></Link>
              <Link to="MainApp" title="Main" ><img src="MainApp.png" className="linkPics" /></Link>
              <Link to="OldMainApp" title="Old Main" ><img src="OldMainApp.png" className="linkPics" /></Link>
              <Link to="ScenarioDropletsApp" title="Scenario Droplets" ><img src="ScenarioDropletsApp.png" className="linkPics" /></Link>
              <Link to="SliderApp" title="Slider" ><img src="SliderApp.png" className="linkPics" /></Link>
            </div>
          </main>
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
      <Route
        path="ExplanationAnim2App"
        element={
          <React.Suspense fallback={<Loader />}>
            <ExplanationAnim2App />
          </React.Suspense>
        }
      />
      <Route
        path="ExplanationAnim2VertApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <ExplanationAnim2VertApp />
          </React.Suspense>
        }
      />
      <Route
        path="ExplanationAnimApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <ExplanationAnimApp />
          </React.Suspense>
        }
      />
      <Route
        path="ExplanationAnimVertApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <ExplanationAnimVertApp />
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
        path="LargeDropletV2App"
        element={
          <React.Suspense fallback={<Loader />}>
            <LargeDropletV2App />
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
        path="OldMainApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <OldMainApp />
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
        path="SliderApp"
        element={
          <React.Suspense fallback={<Loader />}>
            <SliderApp />
          </React.Suspense>
        }
      />
    </Routes>
  </HashRouter>
);

    