"use client";

import dynamic from "next/dynamic";
import StaticBackdrop from "@/components/StaticBackdrop";

// three.js + the shader are only fetched once the browser is idle enough to run
// them; the static gradient stays underneath as the loading and failure layer.
const FluidScene = dynamic(() => import("@/components/FluidScene"), { ssr: false });

export default function BackgroundScene() {
  return (
    <>
      <StaticBackdrop />
      <FluidScene />
    </>
  );
}
