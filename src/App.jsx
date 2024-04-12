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
      <button onClick={() => void setCurScen(scenKeys[++scenCounter.current])}>
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
      <LineGraph curScen={curScen} />
      <BucketViz curScen={curScen} />
      {vert ? <DotPDFVert curScen={curScen} /> : <DotPDF curScen={curScen} />}
    </>
  );
}
