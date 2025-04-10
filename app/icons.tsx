import React from "react";

const CatoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      d="M4 32C10 20 22 12 32 12s22 8 28 20c-6 12-18 20-28 20S10 44 4 32z"
      stroke="black"
      strokeWidth="2"
    />
    <path
      d="M12 32h8l4 8 6-16 4 8h14"
      stroke="black"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="32" cy="32" r="2" fill="black" />
  </svg>
);

export default CatoIcon;
