import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{ display: 'block' }}
        >
          <defs>
            <radialGradient id="lumi-grad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="50%" stopColor="#FF3008" />
              <stop offset="100%" stopColor="#CC2000" />
            </radialGradient>
          </defs>
          {/* Main orb body */}
          <circle cx="16" cy="16" r="14" fill="url(#lumi-grad)" />
          {/* Highlight ellipse */}
          <ellipse cx="13.5" cy="11.5" rx="3.5" ry="2.2" fill="white" opacity="0.3" />
          {/* Happy Eyes (excited: circle size=2) */}
          <circle cx="11.5" cy="12.5" r="2" fill="white" />
          <circle cx="20.5" cy="12.5" r="2" fill="white" />
          {/* Happy Smile */}
          <path
            d="M 12.5 17 Q 16 19.8 19.5 17"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
