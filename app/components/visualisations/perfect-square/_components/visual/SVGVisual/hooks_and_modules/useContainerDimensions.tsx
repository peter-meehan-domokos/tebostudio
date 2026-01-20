'use client'
import { useState, useEffect } from "react";
import { DEFAULT_CONTAINER_MARGIN } from "@/app/components/visualisations/perfect-square/_components/perfect-square/constants";
import { applyMargin } from '@/app/components/visualisations/perfect-square/_components/perfect-square/helpers';
import { getElementDimns } from '@/app/components/visualisations/perfect-square/_helpers/domHelpers';
import { Container } from "@/app/components/visualisations/perfect-square/_components/visual/types";

/**
 * @description A hook that calculates the dimensions of the given element and sets up a listener for any changes to it 
 * @param {Ref} container the element
 * 
 * @return {object} the dimensions - width, height, margin, contentsWidth, contentsHeight
 */

const useContainerDimensions = (container : HTMLElement | null, margin = DEFAULT_CONTAINER_MARGIN):Container | null => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => { 
    if(!container){ return; }

    const updateDimensions = () => {
        const { width, height } = getElementDimns.call(container);
        setWidth(width);
        setHeight(height);
    };
    //init call
    updateDimensions();

    //resize listener
    let resizeObserver = new ResizeObserver(() => { updateDimensions(); }); 
    resizeObserver.observe(container);

    //cleanup
    return () => { resizeObserver.disconnect(); };
  },[container])
  
  return container ? applyMargin(width, height, margin) : null

};

export default useContainerDimensions;
