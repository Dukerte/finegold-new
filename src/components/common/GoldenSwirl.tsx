import React from 'react';

export const GoldenSwirl: React.FC = () => {
  return (
    <svg
      className='absolute top-0 left-0 h-full w-full'
      viewBox='0 0 1440 800'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Main Golden Swirl */}
      <path
        d='M-200 400 Q 200 200 600 300 T 1200 400 T 1600 600'
        stroke='url(#goldGradient)'
        strokeWidth='12'
        fill='none'
        opacity='0.4'
        className='animate-pulse'
      />

      {/* Secondary swirl for depth */}
      <path
        d='M-100 500 Q 300 300 700 400 T 1300 500 T 1700 700'
        stroke='url(#goldGradientSecondary)'
        strokeWidth='8'
        fill='none'
        opacity='0.2'
        className='animate-pulse'
        style={{ animationDelay: '1s' }}
      />

      {/* Additional decorative elements */}
      <circle
        cx='200'
        cy='300'
        r='4'
        fill='url(#goldGradient)'
        opacity='0.6'
        className='animate-ping'
      />

      <circle
        cx='1200'
        cy='500'
        r='3'
        fill='url(#goldGradient)'
        opacity='0.5'
        className='animate-ping'
        style={{ animationDelay: '0.5s' }}
      />

      <defs>
        <linearGradient id='goldGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#FAE1B9' stopOpacity='0.9' />
          <stop offset='50%' stopColor='#E2B56D' stopOpacity='0.7' />
          <stop offset='100%' stopColor='#C28A34' stopOpacity='0.5' />
        </linearGradient>

        <linearGradient
          id='goldGradientSecondary'
          x1='0%'
          y1='0%'
          x2='100%'
          y2='100%'
        >
          <stop offset='0%' stopColor='#F5D7A8' stopOpacity='0.6' />
          <stop offset='50%' stopColor='#DDA95C' stopOpacity='0.4' />
          <stop offset='100%' stopColor='#B87A23' stopOpacity='0.3' />
        </linearGradient>
      </defs>
    </svg>
  );
};
