export const BACKDROP_GRADIENT =
  "radial-gradient(120% 90% at 20% 0%, #ffffff 0%, #f2f6f8 55%, #e9eef1 100%)";

/**
 * Cheap stand-in for the WebGL water scene: same paper/mist palette, zero JS.
 * Used as the loading/failure layer on the home page and as the whole background
 * on the lighter pages.
 */
export default function StaticBackdrop() {
  return <div aria-hidden className="fixed inset-0 -z-10" style={{ background: BACKDROP_GRADIENT }} />;
}
