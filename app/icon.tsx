import { ImageResponse } from 'next/og';

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
          background: '#080c18',
          borderRadius: '22%',
          border: '2px solid #3b82f6',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
        }}
      >
        <div
          style={{
            color: '#60a5fa',
            fontSize: 20,
            fontWeight: 900,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          F
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
