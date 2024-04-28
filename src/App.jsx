import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { objectivesData } from "./data";
import { ticksExact } from "./utils";
import BucketViz from "./BucketViz";
import DotPDF from "./DotPDF";

const MAX_DELIVS = 1200;

export default function App({ data = objectivesData }) {
  const { current: OBJ_NAMES } = useRef(Object.keys(data));
  const [scenNames, setScenNames] = useState(
    data[OBJ_NAMES[0]]["least_to_most"]
  );

  const [curObjective, setCurObjective] = useState(OBJ_NAMES[0]);
  const [curScenIdx, setCurScenIdx] = useState(0);
  const [curScen, setCurScen] = useState(scenNames[curScenIdx]);
  const [goal, setGoal] = useState(200);

  useEffect(() => {
    setScenNames(data[curObjective]["least_to_most"]);
    setCurScenIdx(data[curObjective]["least_to_most"].indexOf(curScen));
  }, [curObjective]);

  useEffect(() => {
    setCurScen(scenNames[curScenIdx]);
  }, [curScenIdx]);

  const len = scenNames.length;
  const delivs = data[curObjective]["scens"][curScen]["delivs"];

  return (
    <div className="dashboard">
      <div className="slider-container">
        <input
          className="input-range"
          orient="vertical"
          type="range"
          value={curScenIdx}
          min="0"
          max={len - 1}
          onChange={(e) => void setCurScenIdx(e.target.value)}
        />
        <div className="scen-name">
          <span>Current Scenario</span>
          <span>{curScen}</span>
        </div>
      </div>
      <div className="bucket-map-container">
        <div className="bucket-viz">
          <div className="bucket-viz-container">
            <span className="main-bucket-label">{curObjective}</span>
            <BucketViz
              bucketId={"mainbucket"}
              levelInterp={d3
                .scaleLinear()
                .domain(ticksExact(0, 1, delivs.length))
                .range(delivs.map((v) => v / MAX_DELIVS || 0))}
              width={100}
              height={100}
            />
            <div
              className="bucket-razor"
              style={{
                top:
                  d3.scaleLinear().domain([0, MAX_DELIVS]).range([100, 0])(
                    goal
                  ) + "px",
              }}
            >
              <span>Goal</span>
            </div>
          </div>
        </div>
        <div className="map"></div>
        <div className="other-buckets-container">
          {OBJ_NAMES.map((name) => (
            <div
              key={name}
              className={
                "bucket-and-label " + (name === curObjective ? "cur-obj" : "")
              }
              onClick={() => setCurObjective(name)}
            >
              <span>{name}</span>
              <BucketViz
                bucketId={name}
                levelInterp={d3
                  .scaleLinear()
                  .domain(
                    ticksExact(
                      0,
                      1,
                      data[name]["scens"][curScen]["delivs"].length
                    )
                  )
                  .range(
                    data[name]["scens"][curScen]["delivs"].map(
                      (v) => v / MAX_DELIVS || 0
                    )
                  )}
                width={50}
                height={50}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pdf-container">
        <DotPDF data={delivs} setGoal={setGoal} />
      </div>
    </div>
  );
}

// import { useRef, useState } from "react";
// import * as d3 from "d3";
// import BucketViz from "./BucketViz";
// import DotPDF from "./DotPDF";
// import LineGraph from "./LineGraph";
// import { objectivesData } from "./data";
// import DotPDFVert from "./DotPDFVert";
// import { ticksExact } from "./utils";

// const scenKeys = Object.keys(deltaData);

// export default function App({}) {
//   const scenCounter = useRef(0);
//   const [vert, setVert] = useState(false);
//   const [curScen, setCurScen] = useState(scenKeys[0]);

//   return (
//     <>
//       <div
//         style={{
//           width: "max-content",
//           top: "50%",
//           left: "50%",
//           position: "absolute",
//           transform: "translate(-50%, -50%)",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             left: "50%",
//             transform: "translate(-50%, -50px)",
//           }}
//         >
//           <button
//             onClick={() => void setCurScen(scenKeys[++scenCounter.current])}
//           >
//             {curScen}
//           </button>
//           <br />
//           <span>Vertical</span>
//           <input
//             type="checkbox"
//             name="vert"
//             id="vert"
//             value={vert}
//             onChange={(e) => void setVert((d) => !d)}
//           />
//         </div>
//         <LineGraph curScen={curScen} />
//         <BucketViz
//           levelInterp={d3
//             .scaleLinear()
//             .domain(ticksExact(0, 1, deltaData[curScen].length))
//             .range(deltaData[curScen].map((v) => v / 400 || 0))}
//           width={100}
//           height={100}
//         />
//         {vert ? <DotPDFVert curScen={curScen} /> : <DotPDF curScen={curScen} />}
//       </div>
//     </>
//   );
// }
