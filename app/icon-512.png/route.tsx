import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const size = 512;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1220",
          borderRadius: 64,
        }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <path
            d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z"
            stroke="url(#g)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M9.5 12.5l1.9 1.9 3.1-3.1"
            stroke="url(#g)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
