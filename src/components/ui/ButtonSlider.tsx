"use client";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import * as ReactJSXRuntime from "react/jsx-runtime";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loading?: boolean;
  className?: string;
}

export const ButtonSlider: React.FC<ButtonProps> = ({
  text,
  loading = false,
  disabled,
  className = "",
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!buttonRef.current || disabled || loading) return;

    const button = buttonRef.current;
    const textElement = textRef.current;

    // Initial setup
    gsap.set(button, { scale: 1 });
    gsap.set(textElement, { y: 0 });

    // Hover animation
    const timeline = gsap.timeline({ paused: true });
    timeline
      .to(button, {
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out",
      })
      .to(
        textElement,
        {
          y: -2,
          duration: 0.2,
          ease: "power2.out",
        },
        "-=0.2"
      );

    // Mouse enter/leave events
    const handleMouseEnter = () => timeline.play();
    const handleMouseLeave = () => timeline.reverse();

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      timeline.kill();
    };
  }, [disabled, loading]);

  return (
    <StyledWrapper>
      <button
        ref={buttonRef}
        className={`button ${className}`}
        data-text={text}
        disabled={disabled || loading}
        {...rest}
      >
        <span ref={textRef} className="actual-text">
          &nbsp;
          {loading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
            </span>
          ) : (
            text
          )}
          &nbsp;
        </span>
        <span aria-hidden="true" className="hover-text">
          &nbsp;
          {loading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
            </span>
          ) : (
            // text
            ""
          )}
          &nbsp;
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    margin: 0;
    height: auto;
    background: #1e5799;
    padding: 0.5rem 1rem; /* Add padding */
    border: none;
    border-radius: 4px; /* Rounded corners */
    cursor: pointer;
    color: #ffff;
    --animation-color: #75bfff;
    --fs-size: 15px;
    letter-spacing: 2px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Montserrat", sans-serif;
    position: relative;
    font-weight: 700; /* Changed from 300 to 700 to make text bold */
    -webkit-text-stroke: 1px var(--text-stroke-color);
    transition: all 0.3s ease;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        45deg,
        rgba(0, 54, 102, 0.1),
        rgba(117, 191, 255, 0.1)
      );
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s ease;
      z-index: 1;
    }

    &:hover:not(:disabled) {
      border-color: #003666;
      box-shadow: 0 4px 15px rgba(0, 54, 102, 0.2);

      &::before {
        transform: scaleX(1);
        transform-origin: left;
      }
    }
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background: rgba(0, 54, 102, 0.05);
  }

  .actual-text,
  .hover-text {
    position: relative;
    z-index: 2;
    display: inline-block;
    transition: transform 0.3s ease;
    font-weight: bold; /* Added bold font weight */
  }

  .hover-text {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: linear-gradient(45deg, #003666, #75bfff);
    -webkit-background-clip: text;
    background-clip: text;
    transition: 0.4s ease-out;
  }

  .button:hover:not(:disabled) .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 12px #75bfff);
  }

  .loading-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(0, 54, 102, 0.3);
    border-top-color: #003666;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .button {
      --fs-size: 13px;
      padding: 0.5rem 1rem;
      letter-spacing: 1.5px;
    }

    .spinner {
      width: 16px;
      height: 16px;
    }
  }
`;
