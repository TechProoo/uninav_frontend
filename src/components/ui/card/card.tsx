import React, { ReactNode } from "react";
import "./card.css";

interface CardProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
