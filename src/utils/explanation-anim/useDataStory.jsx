import { useCallback, useEffect, useState } from "react";
import { animations as anims } from "./data-story-anims";

export function useDataStory(deps, objective, scenario) {
  /*
    slides = [
        name: string,
        animHandler: {
            do: someFunctionToDoAnimation,
            undo: someFunctionToReverseAnimation,
        }
    ]
     */
  const [slides, setSlides] = useState([]);

  useEffect(
    function initialize() {
      if (deps.readyHash === 0) return;

      console.log("scenario", scenario);
      const context = { deps, objective, scenario };

      const chartAnimGroup = anims.initChartAnimGroup(context);
      const bucketsFillAnim = anims.initBucketsFillAnim(context);
      const dropFillAnim = anims.initDropFillAnim(context);
      const showVariationsAnim = anims.initShowVariationsAnim(context);

      const _slides = [
        {
          name: "barsAppear",
          animHandler: chartAnimGroup.barsAppear,
          text: "Bar Graph",
        },
        {
          name: "barsCondense",
          animHandler: chartAnimGroup.barsCondense,
          text: "Gradient",
        },
        {
          name: "bucketsFill",
          animHandler: bucketsFillAnim,
          text: "Bucket",
        },
        {
          name: "forNowLetsFocus",
          animHandler: dropFillAnim,
          text: "Waterdrop",
        },
        {
          name: "ifChangeReality",
          animHandler: showVariationsAnim,
          text: "Different Scenarios",
        },
      ];

      setSlides(_slides);
      console.log("hash changed in datastory");
    },
    [deps.readyHash]
  );

  const getFromTo = useCallback(
    function (from, to) {
      let idxFrom, idxTo;

      for (let i = 0; i < slides.length; i++) {
        if (slides[i].name === from) idxFrom = i;
        else if (slides[i].name === to) {
          idxTo = i;
          break;
        }
      }

      return slides.slice(idxFrom, idxTo + 1);
    },
    [slides]
  );

  return getFromTo;
}
