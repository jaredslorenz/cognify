import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#1A1612",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Italic C */}
      <span
        style={{
          fontSize: 26,
          fontWeight: 300,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          color: "#F4EFE4",
          lineHeight: 1,
          marginTop: -2,
        }}
      >
        C
      </span>
      {/* Indigo dot */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          right: 4,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#3D3580",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
