import React from 'react';

interface ArrowOutwardProps {
  className?: string;
  width?: number;
  height?: number;
}

export const ArrowOutward: React.FC<ArrowOutwardProps> = ({
  className = '',
  width = 26,
  height = 26,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 26 26'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <mask
        id='mask0_76_208'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='26'
        height='26'
      >
        <rect x='0.559875' y='0.456543' width='25' height='25' fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_76_208)'>
        <path
          d='M7.22655 19.2065L5.76822 17.7481L15.7682 7.74813H6.80989V5.66479H19.3099V18.1648H17.2266V9.20646L7.22655 19.2065Z'
          fill='currentColor'
        />
      </g>
    </svg>
  );
};
