import { useRef, useState } from "react";
import BucketViz from "./BucketViz";
import DotPDF from "./DotPDF";
import LineGraph from "./LineGraph";
import { deltaData } from "./data";

const scenKeys = Object.keys(deltaData);

export default function App({}) {
  const scenCounter = useRef(0);
  const [curScen, setCurScen] = useState(scenKeys[0]);

  return (
    <>
      <button onClick={() => void setCurScen(scenKeys[++scenCounter.current])}>
        {curScen}
      </button>
      <LineGraph curScen={curScen} />
      <BucketViz curScen={curScen} />
      <DotPDF curScen={curScen} />
    </>
  );
}
