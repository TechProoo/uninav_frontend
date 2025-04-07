import React from "react";
import "./card.css"
interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="carousel-card">
      <img src={imageUrl} alt={title} className="carousel-card-img" />
      <div className="carousel-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Card;
