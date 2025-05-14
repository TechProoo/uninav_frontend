"use client";
import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loading?: boolean;
}

export const ButtonSlider: React.FC<ButtonProps> = ({
  text,
  loading = false,
  disabled,
  ...rest
}) => {
  return (
    <StyledWrapper>
      <button
        className="button"
        data-text={text}
        disabled={disabled || loading}
        {...rest}
      >
        <span className="actual-text">
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
            ''
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
    background: rgba(117, 191, 255, 0.1); /* Light background */
    padding: 0.5rem 1rem; /* Add padding */
    border: none;
    border-radius: 4px; /* Rounded corners */
    cursor: pointer;
    --border-right: 6px;
    --text-stroke-color: hsl(0, 0%, 0%);
    --animation-color: #75bfff;
    --fs-size: 17px;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial";
    position: relative;
    text-transform: uppercase;
    color: transparent;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }

  .button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .hover-text {
    position: absolute;
    box-sizing: border-box;
    color: var(--animation-color);
    width: 0%;
    white-space: nowrap;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }

  .button:hover:not(:disabled) .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }

  .loading-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top-color: var(--animation-color);
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

  /* Add media query for smaller screens */
  @media (max-width: 768px) {
    .button {
      --fs-size: 14px; /* Smaller font size */
      letter-spacing: 2px; /* Less letter spacing */
      --border-right: 4px; /* Thinner border */
    }

    .spinner {
      width: 16px; /* Smaller spinner */
      height: 16px;
    }
  }
`;
