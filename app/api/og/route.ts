import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'ZedTunes';
  const artist = searchParams.get('artist') || 'Zambian Music';
  const category = searchParams.get('category') || 'Music';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          fontSize: 32,
          fontWeight: 'bold',
          color: '#39FF14',
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ fontSize: '14px', color: '#888888', marginBottom: '20px' }}>
          {category.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            maxWidth: '800px',
            lineHeight: '1.2',
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: '32px', color: '#39FF14' }}>
          by {artist}
        </div>
        <div
          style={{
            marginTop: '40px',
            fontSize: '24px',
            color: '#666666',
          }}
        >
          zedtunez.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}