"use client";
import React, { useEffect, useRef, useState } from "react";

interface SliderProps {
  items: React.ReactNode[];
  autoPlayInterval?: number; // Interval in milliseconds
  itemsPerSlide?: number; // Number of items to show per view
}

const Slider: React.FC<SliderProps> = ({
  items,
  autoPlayInterval = 3000,
  itemsPerSlide = 1,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, totalSlides]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  return (
    <div className="slider">
      <button className="slider-button prev" onClick={prevSlide}>
        &#10094;
      </button>
      <div className="slider-wrapper">
        <div
          className="slider-track"
          ref={trackRef}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`,
            width: `${(items.length / itemsPerSlide) * 100}%`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="slider-item"
              style={{ width: `${100 / items.length}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <button className="slider-button next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default Slider;
