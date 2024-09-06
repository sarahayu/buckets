import { useEffect, useState } from "react";
import { animations as anims } from "./data-story-anims";
import useDataStoryVars from "./useDataStoryVars";

export function useDataStory(objective) {
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
  const vars = useDataStoryVars(objective);

  useEffect(
    function hookAnimations() {
      const context = { deps: vars, objective };

      anims.prepareDOM();

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
    },
    [vars.objectiveVariationDelivs]
  );

  return { slides, vars };
}
