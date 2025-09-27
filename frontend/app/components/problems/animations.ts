// Custom launch animation styles
export const launchModalStyles = `
  @keyframes launchModal {
    0% {
      transform: scale(0.2) translateY(80px) rotateX(15deg);
      opacity: 0;
      filter: blur(4px);
    }
    30% {
      transform: scale(0.8) translateY(20px) rotateX(5deg);
      opacity: 0.6;
      filter: blur(1px);
    }
    60% {
      transform: scale(1.08) translateY(-8px) rotateX(-2deg);
      opacity: 0.9;
      filter: blur(0px);
    }
    80% {
      transform: scale(0.98) translateY(2px) rotateX(1deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) translateY(0) rotateX(0deg);
      opacity: 1;
    }
  }
`;
