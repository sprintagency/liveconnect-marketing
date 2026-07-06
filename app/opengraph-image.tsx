import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social share card. Mirrors the "OpenGraph Image" design handoff:
// dark brand gradient, Nexa headline on the left, event photo on the right.
export const alt = "LiveConnect: Meet the room. Not just a name tag.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontPath = (f: string) => join(process.cwd(), "assets", "fonts", f);

export default async function Image() {
  const [nexa, montserrat, montserratBold, heroData, logoData] =
    await Promise.all([
      readFile(fontPath("Nexa-Light.woff")),
      readFile(fontPath("Montserrat-400.ttf")),
      readFile(fontPath("Montserrat-700.ttf")),
      readFile(join(process.cwd(), "public", "assets", "event-hero.png")),
      readFile(join(process.cwd(), "public", "assets", "liveconnect_clr_w.svg")),
    ]);

  const heroSrc = `data:image/png;base64,${heroData.toString("base64")}`;
  const logoSrc = `data:image/svg+xml;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          color: "#f4f0e8",
          fontFamily: "Montserrat",
          background:
            "linear-gradient(160deg,#16150f 0%,#100f0a 60%,#0b0b08 100%)",
        }}
      >
        {/* ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(8,200,136,0.16),transparent 62%)",
          }}
        />

        {/* LEFT: text */}
        <div
          style={{
            position: "relative",
            width: 660,
            flex: "none",
            padding: "56px 0 56px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <img src={logoSrc} alt="LiveConnect" height={40} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Nexa",
                fontSize: 62,
                lineHeight: 1.02,
                letterSpacing: -1.5,
              }}
            >
              <span>Meet the room.</span>
              <span style={{ color: "#08c888" }}>Not just a name tag.</span>
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 22,
                lineHeight: 1.5,
                color: "#b1aa9c",
                maxWidth: 520,
              }}
            >
              See who&apos;s in the room, find the people who matter, and connect
              in a single tap.
            </div>
          </div>
        </div>

        {/* RIGHT: photo */}
        <div style={{ position: "relative", flex: 1, display: "flex" }}>
          <img
            src={heroSrc}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg,#100f0a 0%,rgba(16,21,15,0.25) 22%,transparent 55%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 26,
              right: 26,
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: "rgba(10,10,11,0.72)",
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#f4f0e8",
              fontSize: 15,
              fontWeight: 700,
              padding: "10px 15px",
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#37d67a",
                boxShadow: "0 0 0 4px rgba(55,214,122,0.25)",
              }}
            />
            238 people here now
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Nexa", data: nexa, style: "normal", weight: 400 },
        { name: "Montserrat", data: montserrat, style: "normal", weight: 400 },
        {
          name: "Montserrat",
          data: montserratBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
