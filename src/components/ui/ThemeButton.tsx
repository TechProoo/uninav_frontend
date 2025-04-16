"use client";
import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const ThemeButton: React.FC<ButtonProps> = ({ text, ...rest }) => {
  return (
    <StyledWrapper>
      <button className="button md:text-sm" data-text={text} {...rest}>
        <span className="actual-text">&nbsp;{text}&nbsp;</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    margin: 0;
    height: auto;
    background: #003666;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    --fs-size: 10px;
    letter-spacing: 2px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial", sans-serif;
    position: relative;
    text-transform: uppercase;
    color: white;
    transition:
      transform 0.2s ease,
      background 0.2s ease;

    &:hover {
      transform: scale(1.05);
      background: #005599;
    }
  }
`;
