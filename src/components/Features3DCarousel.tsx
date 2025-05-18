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

const Features3DCarousel = () => {
  return (
    <StyledWrapper>
      <div className="card-3d perspective-container">
        {SERVICES_DATA.map((service, index) => (
          <div key={index} className="card preserve-3d">
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

export default Features3DCarousel;

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  padding: 6rem 2rem;
  perspective: 2500px;
  background-color: #f0f4f8; // Added a light background for better visibility on about page

  .perspective-container {
    position: relative;
    width: 1000px;
    height: 500px;
    transform-style: preserve-3d;
    animation: autoRun3d 40s linear infinite;
    will-change: transform;
  }

  .preserve-3d {
    transform-style: preserve-3d;
  }

  @keyframes autoRun3d {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }

  .card {
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

  .perspective-container:hover {
    animation-play-state: paused;
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
    color: #75bfff; /* Light blue for heading */
    text-shadow:
      0 1px 1px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.5px;
  }

  .card-content p {
    font-size: 1rem;
    opacity: 1; /* Ensured full opacity */
    margin: 0;
    line-height: 1.5;
    color: #f0f8ff; /* AliceBlue for description - very light */
    font-weight: 500;
    text-shadow:
      0 1px 1px rgba(0, 0, 0, 0.4),
      0 2px 4px rgba(0, 0, 0, 0.2);
  }

  ${SERVICES_DATA.map(
    (_, i) => `
    .card:nth-child(${i + 1}) {
      transform: translate(-50%, -50%) rotateY(${i * (360 / SERVICES_DATA.length)}deg) translateZ(400px);
    }
  `
  ).join("")}

  @media (max-width: 1280px) {
    min-height: 500px;
    padding: 4rem 2rem;

    .perspective-container {
      width: 800px;
      height: 400px;
    }

    .card {
      width: 180px;
      height: 260px;
    }

    ${SERVICES_DATA.map(
      (_, i) => `
      .card:nth-child(${i + 1}) {
        transform: translate(-50%, -50%) rotateY(${i * (360 / SERVICES_DATA.length)}deg) translateZ(350px);
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

  @media (max-width: 1024px) { /* Added specific breakpoint for tablets */
    .perspective-container {
      width: 600px; /* Adjusted for typical tablet view */
      height: 350px;
    }
    .card {
      width: 160px; /* Smaller cards */
      height: 240px;
    }
    ${SERVICES_DATA.map(
      (_, i) => `
      .card:nth-child(${i + 1}) {
        transform: translate(-50%, -50%) rotateY(${i * (360 / SERVICES_DATA.length)}deg) translateZ(300px); /* Reduced translateZ */
      }
    `
    ).join("")}
  }


  @media (max-width: 768px) {
     min-height: 450px; /* Adjusted min-height */
    .perspective-container {
      width: 90vw; /* Use viewport width for better responsiveness */
      max-width: 400px; /* Max width to prevent it from becoming too large on wide small screens */
      height: 300px;
    }

    .card {
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
      .card:nth-child(${i + 1}) {
        transform: translate(-50%, -50%) rotateY(${i * (360 / SERVICES_DATA.length)}deg) translateZ(250px);
      }
    `
    ).join("")}
  }

   @media (max-width: 480px) { /* Added specific breakpoint for mobile phones */
    min-height: 400px;
    padding: 2rem 1rem;
    .perspective-container {
      width: 90vw;
      height: 280px; /* Further reduce height */
    }
    .card {
      width: 130px; /* Smaller cards for mobile */
      height: 200px;
    }
     .card-content {
      padding: 1rem;
    }
    .icon {
      font-size: 1.8rem;
    }
    .card-content h3 {
      font-size: 0.9rem;
    }
    .card-content p {
      font-size: 0.75rem;
    }
    ${SERVICES_DATA.map(
      (_, i) => `
      .card:nth-child(${i + 1}) {
        transform: translate(-50%, -50%) rotateY(${i * (360 / SERVICES_DATA.length)}deg) translateZ(200px); /* Reduced translateZ for mobile */
      }
    `
    ).join("")}
  }
`; 