import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const size = 192;
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
          borderRadius: 32,
        }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M9.5 12.5l1.9 1.9 3.1-3.1"
            stroke="#3b82f6"
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
