import React from 'react';

interface GovCrestProps {
  className?: string;
  size?: number;
}

/**
 * গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের জাতীয় প্রতীক (National Emblem of Bangladesh)
 * Features the central Shapla (Water Lily), rice sheaves, three jute leaves, and 4 red stars.
 */
export const GovCrest: React.FC<GovCrestProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রতীক"
    >
      {/* Outer circular gold border */}
      <circle cx="50" cy="50" r="47" stroke="#006A4E" strokeWidth="2.5" fill="#FFFFFF" className="dark:fill-[#0F1E19] dark:stroke-[#00875A]" />
      <circle cx="50" cy="50" r="43.5" stroke="#C5A059" strokeWidth="1" fill="none" />

      {/* Water Waves (Ripples at bottom) */}
      <path
        d="M26 68 C34 65 42 71 50 68 C58 65 66 71 74 68"
        stroke="#006A4E"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="dark:stroke-[#2DD4BF]"
      />
      <path
        d="M23 73 C32 70 41 76 50 73 C59 70 68 76 77 73"
        stroke="#006A4E"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="dark:stroke-[#2DD4BF]"
      />
      <path
        d="M28 78 C35 75 43 81 50 78 C57 75 65 81 72 78"
        stroke="#006A4E"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="dark:stroke-[#2DD4BF]"
      />

      {/* Central Shapla (Water Lily) */}
      {/* Center Petal */}
      <path
        d="M50 36 C47 47 46 56 50 64 C54 56 53 47 50 36 Z"
        fill="#006A4E"
        className="dark:fill-[#10B981]"
      />
      {/* Inner Left Petal */}
      <path
        d="M50 64 C42 58 40 45 42 39 C47 46 48 55 50 64 Z"
        fill="#006A4E"
        className="dark:fill-[#10B981]"
      />
      {/* Inner Right Petal */}
      <path
        d="M50 64 C58 58 60 45 58 39 C53 46 52 55 50 64 Z"
        fill="#006A4E"
        className="dark:fill-[#10B981]"
      />
      {/* Outer Left Petal */}
      <path
        d="M50 64 C35 60 30 50 32 45 C38 50 43 57 50 64 Z"
        fill="#006A4E"
        opacity="0.9"
        className="dark:fill-[#059669]"
      />
      {/* Outer Right Petal */}
      <path
        d="M50 64 C65 60 70 50 68 45 C62 50 57 57 50 64 Z"
        fill="#006A4E"
        opacity="0.9"
        className="dark:fill-[#059669]"
      />

      {/* Paddy (Rice) Sheaves flanking sides */}
      <path
        d="M20 74 C16 56 20 38 31 27"
        stroke="#C5A059"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="17" cy="62" r="2.2" fill="#C5A059" />
      <circle cx="18" cy="52" r="2.2" fill="#C5A059" />
      <circle cx="21" cy="42" r="2.2" fill="#C5A059" />
      <circle cx="25" cy="33" r="2.2" fill="#C5A059" />
      <circle cx="31" cy="26" r="2.2" fill="#C5A059" />

      <path
        d="M80 74 C84 56 80 38 69 27"
        stroke="#C5A059"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="83" cy="62" r="2.2" fill="#C5A059" />
      <circle cx="82" cy="52" r="2.2" fill="#C5A059" />
      <circle cx="79" cy="42" r="2.2" fill="#C5A059" />
      <circle cx="75" cy="33" r="2.2" fill="#C5A059" />
      <circle cx="69" cy="26" r="2.2" fill="#C5A059" />

      {/* Three connected Jute leaves at top */}
      <path
        d="M50 14 C48 20 48 24 50 28 C52 24 52 20 50 14 Z"
        fill="#006A4E"
        className="dark:fill-[#10B981]"
      />
      <path
        d="M50 28 C45 23 41 18 43 16 C46 19 48 23 50 28 Z"
        fill="#006A4E"
        className="dark:fill-[#10B981]"
      />
      <path
        d="M50 28 C55 23 59 18 57 16 C54 19 52 23 50 28 Z"
        fill="#006A4E"
        className="dark:fill-[#10B981]"
      />

      {/* Four Stars (two on each side) */}
      <polygon
        points="34,18 35.5,21 39,21.5 36.5,24 37,27 34,25.5 31,27 31.5,24 29,21.5 32.5,21"
        fill="#C8102E"
      />
      <polygon
        points="39,27 40,29 42.5,29.5 40.5,31 41,33 39,32 37,33 37.5,31 35.5,29.5 38,29"
        fill="#C8102E"
      />
      <polygon
        points="66,18 67.5,21 71,21.5 68.5,24 69,27 66,25.5 63,27 63.5,24 61,21.5 64.5,21"
        fill="#C8102E"
      />
      <polygon
        points="61,27 62,29 64.5,29.5 62.5,31 63,33 61,32 59,33 59.5,31 57.5,29.5 60,29"
        fill="#C8102E"
      />
    </svg>
  );
};
