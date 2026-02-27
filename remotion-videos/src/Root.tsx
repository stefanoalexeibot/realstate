import React from "react";
import { Composition, registerRoot } from "remotion";
import { PropertyCard, propertyCardDefaultProps } from "./PropertyCard";
import { SalesVideo } from "./SalesVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Sales Video "30 Días" — Horizontal 16:9 ── */}
      <Composition
        id="SalesVideo30Dias"
        component={SalesVideo}
        durationInFrames={1050}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Sales Video "30 Días" — Vertical 9:16 Stories ── */}
      <Composition
        id="SalesVideo30DiasStory"
        component={SalesVideo}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Property Card — Horizontal ── */}
      <Composition
        id="PropertyCard"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={PropertyCard as any}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={propertyCardDefaultProps}
      />

      {/* ── Property Card — Story vertical ── */}
      <Composition
        id="PropertyCardStory"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={PropertyCard as any}
        durationInFrames={420}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={propertyCardDefaultProps}
      />
    </>
  );
};

registerRoot(RemotionRoot);
