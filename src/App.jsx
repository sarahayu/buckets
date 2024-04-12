import { useRef, useState } from "react";
import BucketViz from "./BucketViz";
import DotPDF from "./DotPDF";
import LineGraph from "./LineGraph";
import { deltaData } from "./data";
import DotPDFVert from "./DotPDFVert";

const scenKeys = Object.keys(deltaData);

export default function App({}) {
  const scenCounter = useRef(0);
  const [vert, setVert] = useState(false);
  const [curScen, setCurScen] = useState(scenKeys[0]);

  return (
    <>
      <div
        style={{
          width: "max-content",
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50px)",
          }}
        >
          <button
            onClick={() => void setCurScen(scenKeys[++scenCounter.current])}
          >
            {curScen}
          </button>
          <br />
          <span>Vertical</span>
          <input
            type="checkbox"
            name="vert"
            id="vert"
            value={vert}
            onChange={(e) => void setVert((d) => !d)}
          />
        </div>
        <LineGraph curScen={curScen} />
        <BucketViz curScen={curScen} />
        {vert ? <DotPDFVert curScen={curScen} /> : <DotPDF curScen={curScen} />}
      </div>
    </>
  );
}
