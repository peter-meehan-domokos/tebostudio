'use client';
import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IntroSlide } from '@/app/projects/[slug]/project-config';
import SlideLayout from './slide/SlideLayout';
import Slide from './slide/page';
import './intro.css';

interface ProjectIntroProps {
  slides: IntroSlide[];
  onClose: () => void;
  initD3?: (ref: React.RefObject<HTMLDivElement>) => void;
  cleanupD3?: () => void;
  mobileWarning?: string;
}

export default function ProjectIntro({ slides, onClose, initD3, cleanupD3, mobileWarning }: ProjectIntroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
  };

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onClose();
    } else {
      sliderRef.current?.slickNext();
    }
  };
  
  return (
    <div className="project-intro">
      <div className="intro-slider-container">
        <Slider ref={sliderRef} {...settings}>
          {slides.map((slide, index) => {
            const isLastSlide = index === slides.length - 1;
            const controlButtons = [{
              label: isLastSlide ? "Begin" : "Next",
              onClick: handleNext,
              className: isLastSlide ? "last-slide-controls" : "slide-controls",
              style: isLastSlide ? { background: "#BF40BF" } : { border: "solid", borderWidth: 0.8 }
            }];
            
            return (
              <SlideLayout
                key={`slide-${index}`}
                containerClassNames={isLastSlide ? "last-slide" : ""}
                controlButtons={controlButtons}
                footer={slide.footer}
                mobileWarning={isLastSlide ? mobileWarning : undefined}
              >
                <Slide
                  id={index}
                  title={slide.title}
                  paragraphs={slide.paragraphs}
                  visual={slide.visual}
                />
              </SlideLayout>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
