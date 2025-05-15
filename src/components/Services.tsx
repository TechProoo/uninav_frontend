import React from "react";
import styled from "styled-components";

const SERVICES_DATA = [
  {
    title: "Resource Sharing",
    description: "Share and access academic materials with ease",
    icon: "📚",
  },
  {
    title: "Course Management",
    description: "Organize and track your academic courses",
    icon: "📝",
  },
  {
    title: "Collaboration",
    description: "Connect with peers and faculty members",
    icon: "🤝",
  },
  {
    title: "Study Groups",
    description: "Form and join study groups for better learning",
    icon: "👥",
  },
  {
    title: "Material Reviews",
    description: "Get insights from peer reviews on materials",
    icon: "⭐",
  },
  {
    title: "Digital Library",
    description: "Access a vast collection of digital resources",
    icon: "📖",
  },
  {
    title: "Progress Tracking",
    description: "Monitor your academic progress",
    icon: "📊",
  },
  {
    title: "Discussion Forums",
    description: "Engage in academic discussions",
    icon: "💭",
  },
  {
    title: "File Storage",
    description: "Securely store your academic files",
    icon: "💾",
  },
  {
    title: "Smart Search",
    description: "Find resources quickly and efficiently",
    icon: "🔍",
  },
];

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card-3d">
        {SERVICES_DATA.map((service, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  padding: 6rem 2rem;

  @keyframes autoRun3d {
    from {
      transform: perspective(2500px) rotateY(0deg);
    }
    to {
      transform: perspective(2500px) rotateY(360deg);
    }
  }

  .card-3d {
    position: relative;
    width: 1000px;
    height: 500px;
    transform-style: preserve-3d;
    transform: perspective(2500px);
    animation: autoRun3d 40s linear infinite;
    will-change: transform;
  }

  .card-3d:hover {
    animation-play-state: paused;
  }

  .card-3d .card {
    position: absolute;
    width: 220px;
    height: 300px;
    background: linear-gradient(
      135deg,
      rgba(0, 54, 102, 0.95) 0%,
      rgba(0, 54, 102, 0.85) 100%
    );
    border: solid 1px rgba(255, 255, 255, 0.3);
    border-radius: 1.5rem;
    top: 50%;
    left: 50%;
    transform-origin: center center;
    will-change: transform;
    overflow: hidden;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.1),
      inset 0 0 80px rgba(255, 255, 255, 0.1);
  }

  .card-content {
    padding: 2rem;
    color: #ffffff;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .card-content h3 {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    color: #75bfff;
    text-shadow:
      0 1px 1px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.5px;
  }

  .card-content p {
    font-size: 1rem;
    opacity: 1;
    margin: 0;
    line-height: 1.5;
    color: #f0f8ff;
    font-weight: 500;
    text-shadow:
      0 1px 1px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.2);
  }

  ${SERVICES_DATA.map(
    (_, i) => `
    .card-3d .card:nth-child(${i + 1}) {
      transform: translate(-50%, -50%) rotateY(${i * 36}deg) translateZ(400px);
    }
  `
  ).join("")}

  @media (max-width: 1280px) {
    min-height: 500px;
    padding: 4rem 2rem;

    .card-3d {
      width: 800px;
      height: 400px;
    }

    .card-3d .card {
      width: 180px;
      height: 260px;
    }

    ${SERVICES_DATA.map(
      (_, i) => `
      .card-3d .card:nth-child(${i + 1}) {
        transform: translate(-50%, -50%) rotateY(${i * 36}deg) translateZ(350px);
      }
    `
    ).join("")}

    .card-content {
      padding: 1.5rem;
    }

    .icon {
      font-size: 2.5rem;
    }

    .card-content h3 {
      font-size: 1.2rem;
    }

    .card-content p {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    .card-3d {
      width: 400px;
      height: 300px;
    }

    .card-3d .card {
      width: 150px;
      height: 220px;
    }

    .card-content {
      padding: 1.2rem;
    }

    .icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .card-content h3 {
      font-size: 1rem;
    }

    .card-content p {
      font-size: 0.85rem;
      line-height: 1.4;
    }

    ${SERVICES_DATA.map(
      (_, i) => `
      .card-3d .card:nth-child(${i + 1}) {
        transform: translate(-50%, -50%) rotateY(${i * 36}deg) translateZ(250px);
      }
    `
    ).join("")}
  }
`;

export default Card;
